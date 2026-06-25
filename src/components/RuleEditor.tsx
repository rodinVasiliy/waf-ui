import { type ActionParamView, type RuleForm, type ShortPolicyView } from "../types/Rule"
import { ExprEditor } from "./ExprEditor"
import { RuleOverridesEditor } from "./RuleOverridesEditor"

type RuleEditorProps = {
  title: string

  form: RuleForm

  setForm: React.Dispatch<
    React.SetStateAction<RuleForm>
  >

  availableActions: ActionParamView[]

  availablePolicies: ShortPolicyView[]

  submitText: string

  onSubmit: () => Promise<void>
}

export function RuleEditor({
  form,
  setForm,
  availableActions,
  availablePolicies,
  onSubmit,
}: RuleEditorProps) {

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

  async function submit() {
    // тут твои проверки

    await onSubmit()
  }

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
      
              {availableActions.map(a => (
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
      
              {availablePolicies.map(p => (
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
              <h2>Overrides</h2>
      
              <div style={{ background: "#f9f9f9", padding: 12 }}>
                <RuleOverridesEditor
                    overrides={form.overrides}
                    availablePolicies={availablePolicies}
                    availableActions={availableActions}
                    onChange={overrides =>
                        setForm(f => ({
                        ...f,
                        overrides,
                        }))
                    }
                />
              </div>
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