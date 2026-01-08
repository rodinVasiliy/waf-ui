import type { SSL } from "../types/SSL"

const API_URL = "/admin/api/ssls"

export async function fetchSSLs(): Promise<SSL[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error("Failed to load ssls")
  }
  return res.json()
}