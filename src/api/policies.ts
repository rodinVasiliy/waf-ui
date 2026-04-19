import type { PolicyEdit, PolicyListItem } from "../types/Policy"
import { apiRequest } from "./apirequest"

const API_URL = "/admin/api/policies"

export async function fetchPolicies(): Promise<PolicyListItem[]> {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error("Failed to load policies")
  }
  return res.json()
}

export async function fetchPolicy(id:string): Promise<PolicyEdit>{
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok){
    throw new Error("Failed to load policy by id")
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

export async function updatePolicy(id:string, data:any) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
}