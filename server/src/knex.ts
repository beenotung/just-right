import Knex from 'knex'
import configs from '../knexfile'
import { BlockList, Query, Rule, Setting } from './types'

export let knex = Knex(configs.development)
export let tables = {
  blocklist: knex<BlockList>('blocklist'),
  setting: knex<Setting>('setting'),
  rule: knex<Rule>('setting'),
  query: knex<Query>('setting'),
}
