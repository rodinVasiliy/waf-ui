import type { RuleDetailResponse, RuleListItem } from "../types/Rule"
import { apiRequest } from "./apirequest"

const API_URL = "/admin/api/rules"

export async function fetchRuleDetail(id: string): Promise<RuleDetailResponse> {
  const res = await fetch(`${API_URL}/${id}`)

  if (!res.ok) {
    throw new Error("failed to fetch rule detail")
  }

  return res.json()
}

export async function fetchRules(): Promise<RuleListItem[]> {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error("failed to fetch rules")
  }

  return res.json()
}

export async function updateRule(id:string, data:any) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
}
