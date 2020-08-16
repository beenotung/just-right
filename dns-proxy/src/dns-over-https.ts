import express from 'express'
import HttpStatus from 'http-status'
import fetch from 'node-fetch'
import { DnsRequest } from './native-dns'

const log = require('debug')('dns-proxy')
const Packet = require('native-dns-packet/packet')

export interface DnsProxyOptions {
  app: express.Express
  domainFilter: DomainFilter
}

/**
 * @return true if the domain should be allowed
 * @return false if the domain is banned
 * return promise is also allowed
 * */
export type DomainFilter = (
  domainName: string,
  req: express.Request,
) => boolean | Promise<boolean>

export function attachDnsOverHttpsProxy(options: DnsProxyOptions) {
  const app = options.app
  app.get('/dns-query', (req, res) =>
    handleRequest(req, res, options.domainFilter),
  )
  app.get('/', (req, res) => {
    res.write(`<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DNS-over-HTTPS Server</title>
</head>
<body>
  <h1>DNS-over-HTTPS Server</h1>
  <table>
    <tr>
      <td>Client IP:</td>
      <td>${
        req.header('X-Forwarded-For') ||
        JSON.stringify(req.connection.address())
      }</td>
    </tr>
  </table>
</body>
</html>`)
    res.end()
  })
}

async function handleRequest(
  req: express.Request,
  res: express.Response,
  domainFilter: DomainFilter,
) {
  const dnsBase64 = req.query.dns
  if (typeof dnsBase64 !== 'string') {
    res.status(HttpStatus.BAD_REQUEST)
    res.write('missing dns base64 string in the query params')
    return res
  }
  const buf = Buffer.from(dnsBase64, 'base64')
  const dnsRequest: DnsRequest = Packet.parse(buf)
  for (const question of dnsRequest.question) {
    const domain = question.name
    let result = domainFilter(domain, req)
    if (result === true) {
      return resolveDns(res, dnsBase64)
    }
    if (result === false) {
      return rejectDns(res, domain)
    }
    result = await result
    if (result) {
      return resolveDns(res, dnsBase64)
    }
    return rejectDns(res, domain)
  }
  await resolveDns(res, dnsBase64)
}

async function rejectDns(res: express.Response, domain: string) {
  res.status(HttpStatus.NOT_ACCEPTABLE)
  res.write(`domain '${domain}' is not allowed`)
  res.end()
}

async function resolveDns(res: express.Response, dnsBase64: string) {
  try {
    const response = await fetch(
      'https://dns.google/dns-query?dns=' + dnsBase64,
    )
    const bin = await response.arrayBuffer()
    const buf = Buffer.from(bin)
    res.write(buf)
    res.end()
  } catch (e) {
    log.error('Error: failed to query dns from upstream', e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    res.write('failed to query dns: ' + e.toString())
    res.end()
  }
}
