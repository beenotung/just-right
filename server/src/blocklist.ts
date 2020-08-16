import { extract_lines } from '@beenotung/tslib'
import fetch from 'node-fetch'
import { BlockList } from './database'
import { DnsRule } from './types'

const log = require('debug')('app:blocklist')

export function toRawGithubUrl(url: string): string {
  if (url.startsWith('https://raw.githubusercontent.com/')) {
    return url // already is raw url
  }
  if (!url.startsWith('https://github.com/')) {
    log(`Error: invalid github url:`, url)
    throw new Error('invalid github url')
  }
  return url
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/')
}

function fetchGithub(url: string) {
  url = toRawGithubUrl(url)
  return fetch(url)
}

export async function loadBlockList(blocklist: BlockList): Promise<DnsRule[]> {
  log('load blocklist', blocklist)
  const { url } = blocklist
  if (url.endsWith('.txt')) {
    const rule = await loadBlockListText(blocklist)
    return [rule]
  }
  if (url.endsWith('.json')) {
    return loadBlockListJson(blocklist)
  }
  log(`Error: don't know how to handle block list:`, url)
  throw new Error('unknown blocklist type')
}

async function loadBlockListText(blocklist: {
  name: string
  url: string
}): Promise<DnsRule> {
  const res = await fetchGithub(blocklist.url)
  const text = await res.text()
  for (const addr of ['0.0.0.0', '127.0.0.1']) {
    if (text.includes(addr)) {
      return loadBlockListHosts({ addr, text, name: blocklist.name })
    }
  }
  if (blocklist.url.endsWith('justdomains.txt')) {
    return { domains: extract_lines(text), name: blocklist.name, allow: false }
  }
  log(`Error: unknown block list format:`, blocklist)
  throw new Error(`unknown block list format`)
}

async function loadBlockListHosts(options: {
  addr: string
  text: string
  name: string
}): Promise<DnsRule> {
  const domains = extract_lines(options.text)
    .filter(s => s.startsWith(options.addr))
    .map(s => s.replace(options.addr, '').trim())
  return {
    allow: false,
    domains,
    name: options.name,
  }
}

type NextDnsRecommendedJson = {
  sources: Array<{ url: string; format: string }>
  exclusions: string[]
}

type DisconnectServicesJson = {
  license: string
  categories: {
    [category: string]: Array<{
      [service: string]: {
        [origin: string]: string[]
      }
    }>
  }
}

async function loadBlockListJson(blocklist: BlockList): Promise<DnsRule[]> {
  const res = await fetchGithub(blocklist.url)
  const json = await res.json()
  if (blocklist.url.includes('nextdns-recommended')) {
    return loadNextDnsRecommendedJson({ name: blocklist.name, json })
  }
  if (blocklist.url.includes('disconnect-tracking-protection')) {
    return loadDisconnectServicesJson({ name: blocklist.name, json })
  }
  log(`Error: unknown block list format:`, blocklist)
  throw new Error(`unknown block list format`)
}

async function loadNextDnsRecommendedJson(options: {
  name: string
  json: NextDnsRecommendedJson
}): Promise<DnsRule[]> {
  const rules: DnsRule[] = []
  rules.push({
    allow: true,
    name: options.name,
    domains: options.json.exclusions,
  })
  for (const source of options.json.sources) {
    if (source.format === 'hosts') {
      const rule = await loadBlockListText({
        name: options.name,
        url: source.url,
      })
      rules.push(rule)
    }
  }
  return rules
}

function loadDisconnectServicesJson(options: {
  name: string
  json: DisconnectServicesJson
}): DnsRule[] {
  const rules: DnsRule[] = []
  for (const [category, services] of Object.entries(options.json.categories)) {
    for (const service of services) {
      for (const [serviceName, origins] of Object.entries(service)) {
        for (const [origin, domains] of Object.entries(origins)) {
          if (!Array.isArray(domains)) {
            continue
          }
          const rule: DnsRule = {
            allow: false,
            name: [options.name, category, serviceName].join('/'),
            domains,
          }
          rules.push(rule)
        }
      }
    }
  }
  return rules
}
