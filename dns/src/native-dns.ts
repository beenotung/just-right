var dns = require('native-dns');
var server = dns.createServer();
import * as node_dns from 'dns'

let {NAME_TO_QTYPE, QTYPE_TO_NAME} = require('native-dns-packet/consts')


export type DnsQuestion = {
  name: string
  type: number
  class: number
}
export type DnsRequest = {
  question: DnsQuestion[]
}
type DnsResponse = any

server.on('request', function (request: DnsRequest, response: DnsResponse) {
  // console.log(request)
  for (let question of request.question) {
    console.log({question})
    let rrtype = QTYPE_TO_NAME[question.type]
    console.log({rrtype})
    node_dns.resolve(question.name, rrtype, (err, addresses) => {
      if (err) {
        console.log('failed to resolve', question, err)
        return
      }
      for (let address of addresses) {
        response.answer.push(dns[rrtype]({
          name: question.name,
          address: address,
          ttl: 600,
        }));
      }
      response.send();
    })
  }
});

server.on('error', function (err: any, buff: Buffer, req: DnsRequest, res: DnsResponse) {
  console.log('socket error',err);
  console.log('buff:',buff)
  console.log('req:',req)
  console.log('res:',res)
});

let port = 15353
server.serve(port);
console.log('listening on port', port)
