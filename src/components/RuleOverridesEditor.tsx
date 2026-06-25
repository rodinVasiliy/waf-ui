import { type ActionParamView, type RuleOverrideForm, type ShortPolicyView } from "../types/Rule"

type Props = {
  overrides: RuleOverrideForm[]

  availableActions: ActionParamView[]

  availablePolicies: ShortPolicyView[]

  onChange: (
    overrides: RuleOverrideForm[]
  ) => void
}

export function RuleOverridesEditor({
  overrides,
  availableActions,
  availablePolicies,
  onChange,
}: Props) {

  function addOverride() {
    onChange([
      ...overrides,
      {
        id: "",
        actions: [],
      },
    ])
  }

  function removeOverride(index: number) {
    onChange(
      overrides.filter(
        (_, i) => i !== index
      )
    )
  }

  function updateOverridePolicy(
    index: number,
    policyId: string,
  ) {
    onChange(
      overrides.map((o, i) =>
        i === index
          ? {
              ...o,
              id: policyId,
            }
          : o
      )
    )
  }

  function toggleOverrideAction(
    index: number,
    actionId: string,
  ) {
    onChange(
      overrides.map((o, i) => {
        if (i !== index) {
          return o
        }

        const exists =
          o.actions.includes(actionId)

        return {
          ...o,
          actions: exists
            ? o.actions.filter(
                a => a !== actionId
              )
            : [
                ...o.actions,
                actionId,
              ],
        }
      })
    )
  }

  return (
      <div className="form-group">
        <h2>Policy Overrides</h2>

        <button
          type="button"
          onClick={addOverride}
          style={{ marginBottom: "12px" }}
        >
          + Add Override
        </button>

        {overrides.length === 0 && (
          <div
            style={{
              color: "#666",
              fontStyle: "italic",
            }}
          >
            No overrides configured
          </div>
        )}

        {overrides.map((override, index) => (
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

                  {availablePolicies
                    .filter(
                      p =>
                        p.id === override.id ||
                        !overrides.some(
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
                {availableActions.map(a => (
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
  )
}