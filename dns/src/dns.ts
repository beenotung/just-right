import * as node_dns from "dns";

var dns = require('native-dns');
import {DnsRequest} from "./native-dns";

let {NAME_TO_QTYPE, QTYPE_TO_NAME} = require('native-dns-packet/consts')

export function resolve(req: DnsRequest) {
  for (let question of req.question) {
    let rrtype = QTYPE_TO_NAME[question.type]
    node_dns.resolve(question.name, rrtype, (err, addresses) => {
      for (let address of addresses) {
        let answer = dns[rrtype]({
          name: question.name,
          address: address,
          ttl: 600,
        })
      }
    })
  }
}

