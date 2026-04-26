import type { RuleDetail, RuleListItem } from "../types/Rule"

const API_URL = "/admin/api/rules"

export async function fetchRuleDetail(id: string): Promise<RuleDetail> {
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