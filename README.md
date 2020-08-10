# custom dns proxy

To filter out non-essential domains. Inspired by nextdns.io

current implementation: [dns-over-https](./src/dns-over-https.ts)

## Test
Plain DNS:
```bash
dig -p8053 @127.0.0.1 example.com a
```

DNS-over-TLS:
```bash
dnslookup example.org tls://dns.adguard.com
```

DNS-over-HTTPS:
```bash
dnslookup example.org https://dns.google/dns-query
```

HTTPS Tunnel:
```bash
ngrok http 3000
```

Install dnslookup:
```bash
go get github.com/ameshkov/dnslookup
```
