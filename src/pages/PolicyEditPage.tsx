import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchPolicy, updatePolicy } from "../api/policies"
import type { PolicyEdit } from "../types/Policy"
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse"
import "../App.css"

export function PolicyEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [policy, setPolicy] = useState<PolicyEdit | null>(null)
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

  function update(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }))

    setValidationErrors(prev => {
      const copy = { ...prev }
      delete copy[field]
      return copy
    })
  }

  function updateWL(index: number, value: string) {
    const copy = [...form.wl]
    copy[index] = value
    update("wl", copy)
  }

  function addWL() {
    update("wl", [...form.wl, ""])
  }

  function removeWL(index: number) {
    const copy = form.wl.filter((_, i) => i !== index)
    update("wl", copy)
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
    <div className="form-container">
      <h1>Edit Policy</h1>

      {Object.entries(validationErrors).map(([field, message]) => (
        <p key={field} style={{ color: "red" }}>
          {field}: {message}
        </p>
      ))}

      <div className="form-group">
        <label>Name</label>
        <input
          value={form.name}
          onChange={e => update("name", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>White List</label>

        {form.wl.map((item, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "8px" }}>
            <input
              value={item}
              onChange={e => updateWL(index, e.target.value)}
              style={{ flex: 1 }}
            />
            <button onClick={() => removeWL(index)}>X</button>
          </div>
        ))}

        <button onClick={addWL}>+ Add</button>
      </div>

      <div className="form-group">
        <h2>Rules</h2>

        <table border={1} cellPadding={8} cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policy.rules.map(rule => (
              <tr key={rule.id}>
                <td>{rule.name}</td>
                <td>
                  {rule.actions.map(action => (
                    <span
                      key={action.id}
                      style={{
                        marginRight: "8px",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                      onClick={() => navigate(`/actions/${action.id}`)}
                    >
                      {action.name}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-group">
        <button onClick={submit}>Save</button>
      </div>
    </div>
  )
}