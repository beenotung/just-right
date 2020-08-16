export type BlockList = {
  id: number
  name: string
  url: string
  block: boolean
}
export type Setting = {
  enable_logs: boolean
  log_client_ip: boolean
  log_domain: boolean
  retention_ms: number
}
export type Rule = {
  domain: string
  block: boolean
}
export type Query = {
  domain?: string
  client?: string
  blocked_by?: string
}
