import { attachDnsOverHttpsProxy } from 'dns-proxy'
import express from 'express'
import * as util from 'util'
import { knex, tables } from './knex'
import { startWebTunnel, stopWebTunnel } from './tunnel'
import { Query, Setting } from './types'

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
  const setting = await loadSetting()

  function domainFilter(domain: string): boolean | Promise<boolean> {
    const query: Query = {}
    if (setting.log_client_ip) {
    }
    if (setting.log_domain) {
    }
    return true
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

async function loadSetting(): Promise<Setting> {
  const setting = await tables.setting.first()
  if (!setting) {
    throw new Error('missing setting')
  }
  return setting
}
