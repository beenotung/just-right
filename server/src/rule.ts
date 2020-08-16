import { DnsRule } from './types'

const log = require('debug')('app:rule')

export function isDomainMatch(domain: string, rule: DnsRule): boolean {
  for (let ruleDomain of rule.domains) {
    if (ruleDomain[0] === '*') {
      ruleDomain = ruleDomain.substr(1)
    }
    if (domain.endsWith(ruleDomain)) {
      log(`${domain} match ${ruleDomain}, allow?: ${rule.allow}`)
      return true
    }
  }
  return false
}

export function matchDnsRule(
  domain: string,
  rules: DnsRule[],
): DnsRule | undefined {
  for (const rule of rules) {
    if (isDomainMatch(domain, rule)) {
      return rule
    }
  }
}
