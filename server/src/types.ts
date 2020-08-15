export type BlockList = {
  id: number
  name: string
  url: string
  block: boolean
}
export type Setting = {
  enable_logs: boolean
  log_client_id: boolean
  log_domain: boolean
  retention_ms: number
}
