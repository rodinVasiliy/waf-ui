import { type ExprField, type ExprView, type MatchType } from "../types/Rule"

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

  function updateChild(
    index: number,
    child: ExprView,
  ) {
    const children = [...(node.children || [])]

    children[index] = child

    update("children", children)
  }

  function removeChild(index: number) {
    const children =
      (node.children || []).filter(
        (_, i) => i !== index
      )

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