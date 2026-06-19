import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRuleDetail, updateRule } from "../api/rule"
import {
  type RuleForm,
  type RuleDetailResponse,
  type ExprView,
  type ExprField,
  type MatchType,
  type RuleOverrideForm,
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
     overrides: [] as RuleOverrideForm[],
    policies: [],
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
    const overrides = res.rule.policyOverrides.map(o => ({
      id: o.id,
      actions: o.actions.map(a => a.id),
    }))

    setForm({
      name: res.rule.name,
      enabled: res.rule.enabled,
      actions: res.rule.actions.map(a => a.id),
      policies: res.rule.policies,
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

  function togglePolicy(policyId: string) {
    setForm(f => {
      const exists = f.policies.includes(policyId)

      return {
        ...f,
        policies: exists
          ? f.policies.filter(p => p !== policyId)
          : [...f.policies, policyId],
      }
    })
  }

  function addOverride() {
    setForm(f => ({
      ...f,
      overrides: [
        ...f.overrides,
        {
          id: "",
          actions: [],
        },
      ],
    }))
  }

  function updateOverridePolicy(
    index: number,
    policyId: string,
  ) {
    setForm(f => ({
      ...f,
      overrides: f.overrides.map((o, i) =>
        i === index
          ? {
              ...o,
              id: policyId,
            }
          : o
      ),
    }))
  }

  function toggleOverrideAction(
    index: number,
    actionId: string,
  ) {
    setForm(f => ({
      ...f,
      overrides: f.overrides.map((o, i) => {
        if (i !== index) {
          return o
        }

        const exists = o.actions.includes(actionId)

        return {
          ...o,
          actions: exists
            ? o.actions.filter(a => a !== actionId)
            : [...o.actions, actionId],
        }
      }),
    }))
  }

  function removeOverride(index: number) {
    setForm(f => ({
      ...f,
      overrides: f.overrides.filter((_, i) => i !== index),
    }))
  }

  async function submit() {
    const invalidOverride =
      form.overrides.some(
        o =>
          !o.id ||
          o.actions.length === 0
      )

    if (invalidOverride) {
      alert(
        "Each override must contain a policy and at least one action"
      )
      return
    }
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

      {/* Policies */}
      <div className="form-group">
        <h2>Policies</h2>

        {available_policies.map(p => (
          <label
            key={p.id}
            style={{ display: "block" }}
          >
            <input
              type="checkbox"
              checked={form.policies.includes(p.id)}
              onChange={() => togglePolicy(p.id)}
            />

            {p.name}
          </label>
        ))}
      </div>

      {/* Overrides */}
      <div className="form-group">
        <h2>Policy Overrides</h2>

        <button
          type="button"
          onClick={addOverride}
          style={{ marginBottom: "12px" }}
        >
          + Add Override
        </button>

        {form.overrides.length === 0 && (
          <div
            style={{
              color: "#666",
              fontStyle: "italic",
            }}
          >
            No overrides configured
          </div>
        )}

        {form.overrides.map((override, index) => (
          <div
            key={`${override.id}-${index}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
              background: "#fafafa",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <label>
                Policy
                <select
                  value={override.id}
                  onChange={e =>
                    updateOverridePolicy(
                      index,
                      e.target.value,
                    )
                  }
                  style={{
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  <option value="">
                    Select policy
                  </option>

                  {available_policies
                    .filter(
                      p =>
                        p.id === override.id ||
                        !form.overrides.some(
                          o => o.id === p.id
                        )
                    )
                    .map(p => (
                      <option
                        key={p.id}
                        value={p.id}
                      >
                        {p.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div>
              <strong>Actions</strong>

              <div
                style={{
                  marginTop: "8px",
                }}
              >
                {available_actions.map(a => (
                  <label
                    key={a.id}
                    style={{
                      display: "block",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={override.actions.includes(
                        a.id
                      )}
                      onChange={() =>
                        toggleOverrideAction(
                          index,
                          a.id,
                        )
                      }
                    />

                    {" "}
                    {a.name}
                  </label>
                ))}
              </div>
            </div>

            {(override.id === "" ||
              override.actions.length === 0) && (
              <div
                style={{
                  color: "#d9534f",
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                Override must contain a policy and at least one action
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                removeOverride(index)
              }
              style={{
                marginTop: "12px",
              }}
            >
              Delete Override
            </button>
          </div>
        ))}
      </div>

      {/* Expression */}
      <div className="form-group">
        <h2>Expression</h2>

        <div style={{ background: "#f9f9f9", padding: 12 }}>
          <ExprEditor
          node={form.expr}
          onChange={expr =>
            setForm(f => ({
              ...f,
              expr,
            }))
          }
          />
        </div>
      </div>

      <button onClick={submit}>Save</button>
    </div>
  )
}