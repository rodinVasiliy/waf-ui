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

export async function getSSL(id:string): Promise<SSL> {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error("Failed to fetch ssl config")
  return res.json()
}

export async function updateSSL(id:string, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  if (!res.ok){
    const err = await res.json()
    throw err
  }
}