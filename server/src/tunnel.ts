import ngrok from 'ngrok'

const log = require('debug')('app:tunnel')

export async function startWebTunnel(port: number) {
  const url = await ngrok.connect({
    addr: port,
    onStatusChange: status => {
      log('ngrok status:', status)
    },
  })
  return {
    adminUrl: ngrok.getUrl(),
    tunnelUrl: url,
  }
}

export async function stopWebTunnel() {
  log('disconnect all tunnel')
  await ngrok.disconnect()
  log('kill ngrok')
  await ngrok.kill()
  log('stopped ngrok')
}
