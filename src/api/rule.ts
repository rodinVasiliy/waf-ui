import type { RuleDetailResponse, RuleForm, RuleListItem } from "../types/Rule"
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

const prepareDataForBackend = (form: RuleForm) => {
  const overridesArray = Object.entries(form.overrides).map(([id, actions]) => ({
    id,
    actions
  }));

  return {
    ...form,
    overrides: overridesArray
  };
};

export async function updateRule(id:string, data:RuleForm) {
  const dataToSend = prepareDataForBackend(data);
  return apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(dataToSend),
    headers: { "Content-Type": "application/json" },
  })
}


