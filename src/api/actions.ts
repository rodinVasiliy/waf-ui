import type { Action } from "../types/Action"

const API_URL = "/admin/api"

export async function fetchActions(): Promise<Action[]> {
  const res = await fetch(`${API_URL}/actions`)
  if (!res.ok) {
    throw new Error("Failed to load actions")
  }
  return res.json()
}