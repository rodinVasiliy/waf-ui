import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRuleDetail, updateRule } from "../api/rule"
import {
  type RuleForm,
  type RuleDetailResponse,
  type ExprView,
  type ExprField,
  type MatchType,
} from "../types/Rule"
import "../App.css"

const AVAILABLE_FIELDS: ExprField[] = [
  "IP",
  "Host",
  "Path",
  "Method",
  "UA",
  "CountryCode",
]

const MATCHES: MatchType[] = [
  "equals",
  "in",
  "regex",
]


type Props = {
  node: ExprView
  onChange: (node: ExprView) => void
  onDelete?: () => void
}

export function ExprEditor({
  node,
  onChange,
  onDelete,
}: Props) {

  function update<K extends keyof ExprView>(
    field: K,
    value: ExprView[K],
  ) {
    onChange({
      ...node,
      [field]: value,
    })
  }

  function updateChild(index: number, child: ExprView) {
    const children = [...(node.children || [])]
    children[index] = child

    update("children", children)
  }

  function removeChild(index: number) {
    const children =
      (node.children || []).filter((_, i) => i !== index)

    update("children", children)
  }

  function addCondition() {
    const children = [...(node.children || [])]

    children.push({
      nodeType: "condition",
      isNot: false,
      field: "Host",
      match: "equals",
      value: "",
    })

    update("children", children)
  }

  function addGroup() {
    const children = [...(node.children || [])]

    children.push({
      nodeType: "group",
      isNot: false,
      operator: "and",
      children: [],
    })

    update("children", children)
  }

  // CONDITION
  if (node.nodeType === "condition") {
    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          marginTop: 8,
          background: "#fafafa",
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={node.isNot}
              onChange={e =>
                update("isNot", e.target.checked)
              }
            />
            NOT
          </label>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          {/* FIELD */}
          <select
            value={node.field}
            onChange={e =>
              update("field", e.target.value as ExprField)
            }
          >
            {AVAILABLE_FIELDS.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* MATCH */}
          <select
            value={node.match}
            onChange={e =>
              update("match", e.target.value as MatchType)
            }
          >
            {MATCHES.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* VALUE */}
          <input
            placeholder="value"
            value={node.value || ""}
            onChange={e =>
              update("value", e.target.value)
            }
          />

          {onDelete && (
            <button onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    )
  }

  // GROUP
  return (
    <div
      style={{
        borderLeft: "3px solid #999",
        marginTop: 12,
        paddingLeft: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={node.isNot}
            onChange={e =>
              update("isNot", e.target.checked)
            }
          />
          NOT
        </label>

        <select
          value={node.operator}
          onChange={e =>
            update("operator", e.target.value as "and" | "or")
          }
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>

        {onDelete && (
          <button onClick={onDelete}>
            Delete Group
          </button>
        )}
      </div>

      {/* CHILDREN */}
      <div style={{ marginTop: 8 }}>
        {(node.children || []).map((child, index) => (
          <ExprEditor
            key={index}
            node={child}
            onChange={updated =>
              updateChild(index, updated)
            }
            onDelete={() =>
              removeChild(index)
            }
          />
        ))}
      </div>

      {/* ADD */}
      <div
        style={{
          marginTop: 8,
          display: "flex",
          gap: 8,
        }}
      >
        <button onClick={addCondition}>
          + Condition
        </button>

        <button onClick={addGroup}>
          + Group
        </button>
      </div>
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

    expr: {
      nodeType: "group",
      isNot: false,
      operator: "and",
      children: [],
    },
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
      expr: res.rule.expr
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

  const { available_actions, available_policies } = data

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
          <ExprEditor node={form.expr} onChange={expr => setForm(f => ({...f, expr, }))} />
        </div>
      </div>

      <button onClick={submit}>Save</button>
    </div>
  )
}