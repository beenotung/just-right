import Knex from 'knex'
import configs from '../knexfile'

export let knex = Knex(configs.development)
export let tables = {
  blocklist: knex<BlockList>('blocklist'),
  setting: knex<Setting>('setting'),
  rule: knex<Rule>('rule'),
  query: knex<Query>('query'),
}
export type BlockList = {
  id: number
  name: string
  url: string
  block: boolean
}
export type Setting = {
  enable_logs: boolean
  log_client_ip: boolean
  log_domain: boolean
  retention_ms: number
}
export type Rule = {
  domain: string
  block: boolean
}
export type Query = {
  domain?: string
  client?: string
  blocked: boolean
  reason: string
}
