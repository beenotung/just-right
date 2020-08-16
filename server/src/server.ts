import { attachDnsOverHttpsProxy } from 'dns-proxy'
import express from 'express'
import * as util from 'util'
import { loadConfig } from './config'
import { knex, Query, tables } from './database'
import { matchDnsRule } from './rule'
import { startWebTunnel, stopWebTunnel } from './tunnel'
import { DnsRule } from './types'

const log = require('debug')('app:server')
log.enabled = true

export async function startServer(options: {
  port: number
}): Promise<{
  tunnelUrl: string
  adminUrl: string
  close: () => Promise<void>
}> {
  log('load setting')
  const { setting, rules } = await loadConfig()

  // TODO pre-compute to optimize execution speed
  function domainFilter(domain: string, req: express.Request): boolean {
    const rule = matchDnsRule(domain, rules)
    if (rule) {
      save(rule)
      return rule.allow
    }
    return true

    function save(rule: DnsRule) {
      const query: Query = {
        blocked: rule.allow,
        reason: rule.name,
      }
      if (setting.log_client_ip) {
        query.client = req.header('X-Forwarded-For')
      }
      if (setting.log_domain) {
        query.domain = domain
      }
      log('query:', query)
      tables.query.insert(query).catch(e => {
        log(`Error: failed to log query:`, e)
      })
    }
  }

  const app = express()
  log('attachDnsOverHttpsProxy')
  attachDnsOverHttpsProxy({
    app,
    domainFilter,
  })
  log('listen on port', options.port)
  const server = app.listen(options.port, () => {
    log('express server: http://127.0.0.1:' + options.port)
  })

  log('start web tunnel')
  const { tunnelUrl, adminUrl } = await startWebTunnel(options.port)
  log('ngrok admin url:', adminUrl)
  log('tunnel url:', tunnelUrl)
  log('dns-over-https url:', tunnelUrl + '/dns-query')
  return {
    tunnelUrl,
    adminUrl,
    close: async () => {
      log('stop web tunnel')
      await stopWebTunnel()
      log('stop http server')
      await util.promisify(server.close.bind(server))()
      log('stop database connection')
      await knex.destroy()
      log('stopped dns-over-https server')
    },
  }
}
