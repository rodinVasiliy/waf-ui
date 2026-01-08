import type { Action } from "../types/Action"

const API_URL = "/admin/api/actions"

export async function fetchActions(): Promise<Action[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error("Failed to load actions")
  }
  return res.json()
}