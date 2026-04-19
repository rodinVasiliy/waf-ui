import type { PolicyListItem } from "../types/Policy"

const API_URL = "/admin/api/policies"

export async function fetchPolicies(): Promise<PolicyListItem[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error("Failed to load policies")
  }
  return res.json()
}

export async function deletePolicy(id:string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  if (!res.ok) {
    const err = await res.json()
    throw err
  }
}