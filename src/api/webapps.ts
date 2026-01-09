import type { WebApp } from "../types/WebApp"
import { apiRequest } from "./apirequest"

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

export async function createWebApp(data: any) {
    return apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
}