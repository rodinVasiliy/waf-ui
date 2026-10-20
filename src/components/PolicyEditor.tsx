import { useNavigate } from "react-router-dom"
import type { PolicyEdit } from "../types/Policy"

type PolicyEditorProps = {

    title: string

    form: PolicyEdit

    setForm: React.Dispatch<
        React.SetStateAction<PolicyEdit>
    >

    validationErrors:
        Record<string,string>

    setValidationErrors:
        React.Dispatch<
            React.SetStateAction<
                Record<string,string>
            >
        >

    onSubmit: () => Promise<void>

}

export function PolicyEditor({
  title,
  form,
  setForm,
  validationErrors,
  setValidationErrors,
  onSubmit,
}: PolicyEditorProps) {

  const navigate = useNavigate()
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

    return (
    <div className="form-container">
      <h1>{title}</h1>

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
            </tr>
          </thead>
          <tbody>
            {form.rules.map(rule => (
              <tr key={rule.id}>
                <td>
                   <span
                      key={rule.id}
                      style={{
                        marginRight: "8px",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                      onClick={() => navigate(`/rules/${rule.id}/edit`)}
                    >
                      {rule.name}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-group">
        <button onClick={onSubmit}>Save</button>
      </div>
    </div>
  )
}