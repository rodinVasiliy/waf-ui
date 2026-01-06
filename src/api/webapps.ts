import type { WebApp } from "../types/WebApp"

const API_URL = "/admin/api/webapps"

export async function fetchWebApps(): Promise<WebApp[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error("Failed to load web apps")
  }
  return res.json()
}

export async function deleteWebApp(id:string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error("Failed to delete web app")
}