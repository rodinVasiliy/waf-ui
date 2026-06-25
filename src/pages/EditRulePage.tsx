import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRuleDetail, updateRule } from "../api/rule"
import {
  type RuleForm,
  type RuleDetailResponse,
  emptyRuleForm,
} from "../types/Rule"
import "../App.css"
import { RuleEditor } from "../components/RuleEditor"


// RuleEditPage.tsx

export function RuleEditPage() {
  const { id } = useParams()

  const [data, setData] = useState<RuleDetailResponse | null>(null)
  const [form, setForm] = useState<RuleForm>(emptyRuleForm)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    const res = await fetchRuleDetail(id!)

    setData(res)

    setForm({
      name: res.rule.name,
      enabled: res.rule.enabled,
      actions: res.rule.actions.map(a => a.id),
      policies: res.rule.policies.map(p => p.id),
      overrides: res.rule.policyOverrides.map(o => ({
        id: o.id,
        actions: o.actions.map(a => a.id),
      })),
      expr: res.rule.expr,
    })
  }

  async function submit() {
    await updateRule(id!, form)
  }

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <RuleEditor
      title="Edit Rule"
      form={form}
      setForm={setForm}
      availableActions={data.available_actions}
      availablePolicies={data.available_policies}
      onSubmit={submit}
      submitText="Save"
    />
  )
}