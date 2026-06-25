import { useEffect, useState } from "react"
import { createRule, fetchRuleMeta } from "../api/rule"
import {
  type RuleForm,
  emptyRuleForm,
  type RuleMetaResponse,
} from "../types/Rule"
import "../App.css"
import { RuleEditor } from "../components/RuleEditor"

export function RuleCreatePage() {
  const [meta, setMeta] =
    useState<RuleMetaResponse | null>(null)

  const [form, setForm] =
    useState<RuleForm>(emptyRuleForm)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const res = await fetchRuleMeta()
    setMeta(res)
  }

  async function submit() {
    await createRule(form)
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
      onSubmit={submit}
      submitText="Create"
    />
  )
}