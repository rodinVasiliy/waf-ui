import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchSSLFiles, getSSL, updateSSL } from "../api/ssls"
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse"


export function SSLEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [certs, setCertFiles] = useState<string[]>([])
  const [keys, setKeyFiles] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: "",
    cert: "",
    key: "",
  })

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    try {
      const [files, ssl] = await Promise.all([
        fetchSSLFiles(),
        getSSL(id!)
      ])

      setCertFiles(files.certs)
      setKeyFiles(files.keys)

      setForm({
        name: ssl.name,
        cert: ssl.cert,
        key: ssl.key,
      })
    } catch (e) {
      alert("Failed to load data")
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

  async function submit() {
    setValidationErrors({})

    try {
      await updateSSL(id!, form)
      alert("Updated!")
      navigate("/ssls")
    } catch (err: unknown) {
      const e = err as ValidationErrorResponse
      if (e.code === "validation_error") {
        setValidationErrors(e.fields)
        return
      }
      alert("Unexpected error")
    }
  }

  return (
    <div>
      <h1>Edit SSL</h1>

      {Object.entries(validationErrors).map(([field, message]) => (
        <p key={field} style={{ color: "red" }}>
          {field}: {message}
        </p>
      ))}

      <label>Name</label>
      <input value={form.name} onChange={e => update("name", e.target.value)} />

      <label>Certificate file</label>
      <select value={form.cert} onChange={e => update("cert", e.target.value)}>
        <option value="">Select certificate…</option>
        {certs.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <label>Key file</label>
      <select value={form.key} onChange={e => update("key", e.target.value)}>
        <option value="">Select key…</option>
        {keys.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <button onClick={submit}>Save</button>
    </div>
  )
}