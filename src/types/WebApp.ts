export interface WebApp {
  id: string
  name: string
  policyId?: string
  port: number
  sslId?: string
  upstream: string
  hosts: string[]
}