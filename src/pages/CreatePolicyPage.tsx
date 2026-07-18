import { useNavigate } from "react-router-dom"
import { emptyPolicyForm, type PolicyEdit } from "../types/Policy"
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse"
import { useState } from "react"
import { PolicyEditor } from "../components/PolicyEditor"
import { createPolicy } from "../api/policies"


export function PolicyCreatePage() {
  const navigate = useNavigate()

  const [policy, setPolicy] = useState<PolicyEdit>(emptyPolicyForm)

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string>>({})

  async function submit() {
    try {
    setValidationErrors({})

    await createPolicy(policy)
    alert("Updated!")
    navigate("/policies")

  } catch (err) {

    const e = err as ValidationErrorResponse

    if (e.code === "validation_error") {
      setValidationErrors(e.fields)
      return
    }

    alert("Unexpected error")
  }
  }

  return (
    <PolicyEditor
      title="Create Policy"
      form={policy}
      setForm={setPolicy}
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
      onSubmit={submit}
    />
  )
}