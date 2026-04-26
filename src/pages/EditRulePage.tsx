import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRuleDetail } from "../api/rule"
import type { RuleDetail } from "../types/Rule"
import "../App.css"

export function RuleDetailPage() {
  const { id } = useParams()

  const [rule, setRule] = useState<RuleDetail | null>(null)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    try {
      const data = await fetchRuleDetail(id!)
      setRule(data)
    } catch (e) {
      alert("Failed to load rule")
    }
  }

  if (!rule) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <h1>Rule Detail</h1>

      {/* Name */}
      <div className="form-group">
        <label>Name</label>
        <div>{rule.name}</div>
      </div>

      {/* Enabled */}
      <div className="form-group">
        <label>Enabled</label>
        <div>{rule.enabled ? "Yes" : "No"}</div>
      </div>

      {/* Actions */}
      <div className="form-group">
        <label>Actions</label>
        <div>
          {rule.actions.length === 0 && <span>No actions</span>}

          {rule.actions.map(a => (
            <span
              key={a.id}
              style={{
                marginRight: "8px",
                textDecoration: "underline",
              }}
            >
              {a.name}
            </span>
          ))}
        </div>
      </div>

      {/* Override Actions */}
      <div className="form-group">
        <h2>Override Actions (Policies)</h2>

        {rule.policyActionParams.length === 0 && (
          <div>No overrides</div>
        )}

        {rule.policyActionParams.length > 0 && (
          <table border={1} cellPadding={8} cellSpacing={0} width="100%">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rule.policyActionParams.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>
                    {p.actions.length === 0 && <span>No actions</span>}

                    {p.actions.map(a => (
                      <span
                        key={a.id}
                        style={{
                          marginRight: "8px",
                          textDecoration: "underline",
                        }}
                      >
                        {a.name}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}