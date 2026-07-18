import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchPolicy, updatePolicy } from "../api/policies"
import { emptyPolicyForm, type PolicyEdit } from "../types/Policy"
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse"
import "../App.css"
import { PolicyEditor } from "../components/PolicyEditor"

export function PolicyEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [policy, setPolicy] = useState<PolicyEdit>(emptyPolicyForm)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: "",
    wl: [] as string[],
  })

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    try {
      const data = await fetchPolicy(id!)

      setPolicy(data)

      setForm({
        name: data.name,
        wl: data.wl,
      })
    } catch (e) {
      alert("Failed to load policy")
    }
  }

  async function submit() {
    setValidationErrors({})

    try {
      await updatePolicy(id!, form)
      alert("Updated!")
      navigate("/policies")
    } catch (err: unknown) {
      const e = err as ValidationErrorResponse

      if (e.code === "validation_error") {
        setValidationErrors(e.fields)
        return
      }

      alert("Unexpected error")
    }
  }

  if (!policy) {
    return <div>Loading...</div>
  }

  return (
    <PolicyEditor
      title="Edit Policy"
      form={policy}
      setForm={setPolicy}
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
      onSubmit={submit}
    />
  )
}