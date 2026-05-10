import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRuleDetail, updateRule } from "../api/rule"
import {
  type RuleForm,
  type RuleDetailResponse,
} from "../types/Rule"
import "../App.css"

function ExprNode({ node }: any) {
  if (node.nodeType === "condition") {
    return (
      <div style={{ marginLeft: "16px" }}>
        {node.isNot && <strong>NOT </strong>}
        <span style={{ color: "#2c7be5" }}>{node.field}</span>{" "}
        <span>{node.match}</span>{" "}
        <span style={{ color: "#e5533d" }}>"{node.value}"</span>
      </div>
    )
  }

  return (
    <div style={{ borderLeft: "2px solid #ccc", marginLeft: 16, paddingLeft: 12 }}>
      <div>
        {node.isNot && <strong>NOT </strong>}
        <strong>{node.operator?.toUpperCase()}</strong>
      </div>
      {node.children?.map((c: any, i: number) => (
        <ExprNode key={i} node={c} />
      ))}
    </div>
  )
}

export function RuleEditPage() {
  const { id } = useParams()

  const [data, setData] = useState<RuleDetailResponse | null>(null)

  const [form, setForm] = useState<RuleForm>({
    name: "",
    enabled: false, 
    actions: [],
    overrides: {},
  })

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    const res = await fetchRuleDetail(id!)
    setData(res)

    // init form
    const overrides: Record<string, string[]> = {}

    res.rule.policyActionParams.forEach(p => {
      overrides[p.id] = p.actions.map(a => a.id)
    })

    setForm({
      name: res.rule.name,
      enabled: res.rule.enabled,
      actions: res.rule.actions.map(a => a.id),
      overrides,
    })
  }

  function toggleAction(actionId: string) {
    setForm(f => {
      const exists = f.actions.includes(actionId)
      return {
        ...f,
        actions: exists
          ? f.actions.filter(a => a !== actionId)
          : [...f.actions, actionId],
      }
    })
  }

  function toggleOverride(policyId: string, actionId: string) {
    setForm(f => {
      const current = f.overrides[policyId] || []
      const exists = current.includes(actionId)

      return {
        ...f,
        overrides: {
          ...f.overrides,
          [policyId]: exists
            ? current.filter(a => a !== actionId)
            : [...current, actionId],
        },
      }
    })
  }

  async function submit() {
    await updateRule(id!, form)
    alert("Saved!")
  }

  if (!data) return <div>Loading...</div>

  const { rule, available_actions, available_policies } = data

  return (
    <div className="form-container">
      <h1>Edit Rule</h1>

      {/* Name */}
      <div className="form-group">
        <label>Name</label>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>

      {/* Enabled */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={e =>
              setForm(f => ({ ...f, enabled: e.target.checked }))
            }
          />
          Enabled
        </label>
      </div>

      {/* Actions */}
      <div className="form-group">
        <h2>Actions</h2>

        {available_actions.map(a => (
          <label key={a.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={form.actions.includes(a.id)}
              onChange={() => toggleAction(a.id)}
            />
            {a.name}
          </label>
        ))}
      </div>

      {/* Overrides */}
      <div className="form-group">
        <h2>Policy Overrides</h2>

        {available_policies.map(p => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>{p.name}</strong>

            <div style={{ marginTop: "8px" }}>
              {available_actions.map(a => (
                <label key={a.id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={(form.overrides[p.id] || []).includes(a.id)}
                    onChange={() => toggleOverride(p.id, a.id)}
                  />
                  {a.name}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Expression */}
      <div className="form-group">
        <h2>Expression</h2>

        <div style={{ background: "#f9f9f9", padding: 12 }}>
          <ExprNode node={rule.expr} />
        </div>
      </div>

      <button onClick={submit}>Save</button>
    </div>
  )
}