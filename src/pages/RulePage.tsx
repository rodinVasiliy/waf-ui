import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchRules } from "../api/rule"
import type { RuleListItem } from "../types/Rule"
import "../App.css"

export function RulesListPage() {
  const navigate = useNavigate()

  const [rules, setRules] = useState<RuleListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await fetchRules()
      setRules(data)
    } catch (e) {
      alert("Failed to load rules")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-container">
      <h1>Rules</h1>

      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Enabled</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(rule => (
            <tr key={rule.id}>
              <td>{rule.enabled ? "Yes" : "No"}</td>

              <td>
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate(`/rules/${rule.id}/edit`)}
                >
                  {rule.name}
                </span>
              </td>
            </tr>
          ))}

          {rules.length === 0 && (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                No rules
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}