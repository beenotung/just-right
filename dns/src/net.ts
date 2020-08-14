import * as net from "net";
import * as dgram from "dgram";

let port = 8053

let server = net.createServer()
server.on("connection", socket => {
  console.log('connection')
})
server.on('listening', () => {
  console.log('listening on port', port)
})
server.on("error", err => {
  console.log('error', err)
})
server.listen(port, '0.0.0.0',)
