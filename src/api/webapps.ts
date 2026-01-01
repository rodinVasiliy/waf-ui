import type { WebApp } from "../types/WebApp"

const API_URL = "http://localhost:8080/api"

export async function fetchWebApps(): Promise<WebApp[]> {
  const res = await fetch(`${API_URL}/webapps`)
  if (!res.ok) {
    throw new Error("Failed to load web apps")
  }
  return res.json()
}