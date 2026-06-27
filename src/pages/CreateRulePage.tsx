import { useEffect, useState } from "react"
import { createRule, fetchRuleMeta } from "../api/rule"
import {
  type RuleForm,
  emptyRuleForm,
  type RuleMetaResponse,
} from "../types/Rule"
import "../App.css"
import { RuleEditor } from "../components/RuleEditor"
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse"
import { useNavigate } from "react-router-dom"

export function RuleCreatePage() {
  const navigate = useNavigate()

  const [meta, setMeta] =
    useState<RuleMetaResponse | null>(null)

  const [form, setForm] =
    useState<RuleForm>(emptyRuleForm)

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string>>({})

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const res = await fetchRuleMeta()
    setMeta(res)
  }

  async function submit() {
    try {
    setValidationErrors({})

    await createRule(form)
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

  if (!meta) {
    return <div>Loading...</div>
  }

  return (
    <RuleEditor
      title="Create Rule"
      form={form}
      setForm={setForm}
      availableActions={meta.available_actions}
      availablePolicies={meta.available_policies}
      validationErrors={validationErrors}
      onSubmit={submit}
      submitText="Create"
    />
  )
}