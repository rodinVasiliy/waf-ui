import type { SSL } from "../types/SSL"
import { apiRequest } from "./apirequest"

const API_URL = "/admin/api/ssls"

export async function fetchSSLs(): Promise<SSL[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error("Failed to load ssls")
  }
  return res.json()
}

export async function fetchSSLFiles() {
    const res = await fetch(`${API_URL}/files`)
    return res.json() as Promise<{
      certs: string[]
      keys: string[]
    }>
}

export async function createSSL(data: any) {
    return apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
}
export async function deleteSSL(id:string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error("Failed to delete ssl config")
}