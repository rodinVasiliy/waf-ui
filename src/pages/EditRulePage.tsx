import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchRuleDetail, updateRule } from "../api/rule"
import {
  type RuleDetailResponse,
  emptyRuleForm,
} from "../types/Rule"
import "../App.css"
import { RuleEditor } from "../components/RuleEditor"
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse"


// RuleEditPage.tsx

export function RuleEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] =
    useState<RuleDetailResponse | null>(null)

  const [form, setForm] =
    useState(emptyRuleForm)

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string>>({})

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
    try {
    setValidationErrors({})

    await updateRule(id!, form)
    alert("Updated!")
    navigate("/rules")

  } catch (err) {

    const e = err as ValidationErrorResponse

    if (e.code === "validation_error") {
      setValidationErrors(e.fields)
      return
    }

    alert("Unexpected error")
  }
    
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
      validationErrors={validationErrors}
      onSubmit={submit}
      submitText="Save"
    />
  )
}