
import { loadBlockList } from './blocklist'
import { Setting, tables } from './database'
import { DnsRule } from './types'

const log = require('debug')('app:config')
log.enabled = true

export async function loadConfig() {
  const setting = await loadSetting()
  const dnsRules: DnsRule[] = []
  for (const blocklist of await tables.blocklist) {
    const rules = await loadBlockList(blocklist)
    dnsRules.push(...rules)
  }
  return { setting, rules: dnsRules }
}

async function loadSetting(): Promise<Setting> {
  const setting = await tables.setting.first()
  if (!setting) {
    throw new Error('missing setting')
  }
  return setting
}
