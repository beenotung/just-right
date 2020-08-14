import express from 'express'
import fetch from 'node-fetch'
import {DnsRequest} from "./native-dns";

let Packet = require('native-dns-packet/packet')

let port = 3000
let app = express()
app.listen(port, () => {
  console.log('express listening on port', port)
})
app.get('/dns-query', handleRequest)
app.get('/', (req, res) => {
  res.write('dns-over-https server')
  res.end()
})

async function handleRequest(req: express.Request, res: express.Response, next: Function) {
  let dns = req.query.dns;
  if (typeof dns !== "string") {
    return next()
  }
  let buf = Buffer.from(dns, 'base64')
  let dnsRequest: DnsRequest = Packet.parse(buf)
  console.log('q', dnsRequest.question)
  try {
    let response = await fetch('https://dns.google/dns-query?dns=' + dns)
    let buf =Buffer.from( await response.arrayBuffer())
    res.write(buf)
    res.end()
    return
  } catch (e) {
    console.log('failed to query dns from upstream', e)
    return
  }
}
