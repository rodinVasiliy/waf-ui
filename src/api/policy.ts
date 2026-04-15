import type { Policy } from "../types/Policy"

const API_URL = "/admin/api/policies"

export async function fetchPolicies(): Promise<Policy[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error("Failed to load policies")
  }
  return res.json()
}