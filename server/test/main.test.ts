import { startServer } from '../src/server'
import fetch from 'node-fetch'

describe('DNS-over-HTTPS Server TestSuit', () => {
  let dnsUrl: string
  let close: () => Promise<void>
  it('should start server', async () => {
    const res = await startServer({ port: 5053 })
    expect(res).toBeDefined()
    expect(typeof res.close).toEqual('function')
    expect(typeof res.tunnelUrl).toEqual('string')
    dnsUrl = res.tunnelUrl + '/dns-query'
    close = res.close
  })
  it('should be able to query dns record', async () => {
    const res = await fetch(
      dnsUrl + '?dns=lHcBAAABAAAAAAAAB2V4YW1wbGUDb3JnAAABAAE',
    )
    const bin = await res.arrayBuffer()
    expect(bin).toBeDefined()
    expect(bin.byteLength).toBeGreaterThan(1)
  })
  it('should close server', async () => {
    await close()
  })
})
