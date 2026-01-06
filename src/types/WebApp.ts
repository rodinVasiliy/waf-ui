export interface WebApp {
  id: string
  name: string

  policyId?: string
  policyName?: string
  
  sslId?: string
  sslName?: string

  port: number
  upstream: string
  hosts: string[]
}