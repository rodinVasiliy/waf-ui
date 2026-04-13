import { useEffect, useState } from "react";
import { createWebApp } from "../api/webapps";
import { fetchSSLs } from "../api/ssls";
import { fetchPolicies } from "../api/policies";
import { useNavigate } from "react-router-dom"
import type { Policy } from "../types/Policy";
import type { SSL } from "../types/SSL";
import "../App.css"

export function WebAppCreatePage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [ssls, setSSLs] = useState<SSL[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: "",
    policyId: "",
    sslId: "",
    upstream: "",
    port: "",
    hosts: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const p = await fetchPolicies()
    const s = await fetchSSLs()
    setPolicies(p)
    setSSLs(s)
  }

  function update(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function submit() {
    const errors: Record<string, string> = {}

    if (!form.port) {
      errors.port = "Port is required"
    } else if (!/^\d+$/.test(form.port)) {
      errors.port = "Port must be a number"
    } else {
      const num = Number(form.port)
      if (num < 1 || num > 65535) {
        errors.port = "Port must be between 1 and 65535"
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    const payload = {
      ...form,
      port: Number(form.port),
      hosts: form.hosts.split(",").map(h => h.trim())
    }

    try {
      await createWebApp(payload)
      alert("Created!")
      navigate("/webapps")
    } catch (err: any) {
      if (err.code === "validation_error") {

        const normalized: Record<string, string> = {}

        for (const key in err.fields) {
          const normalizedKey =
            key.charAt(0).toLowerCase() + key.slice(1)

          normalized[normalizedKey] = err.fields[key]
        }

        setValidationErrors(normalized)
        return
      }

      alert("Unexpected error")
    }
  }

  return (
    <div className="form-container">
      <h1>Create WebApp</h1>

      <div className="form-group">
        <label>Name</label>
        <input value={form.name} onChange={e => update("name", e.target.value)} />
        {validationErrors.name && (
          <div style={{ color: "red" }}>{validationErrors.name}</div>
        )}
      </div>

      <div className="form-group">
        <label>Upstream</label>
        <input value={form.upstream} onChange={e => update("upstream", e.target.value)} />
        {validationErrors.upstream && (
          <div style={{ color: "red" }}>{validationErrors.upstream}</div>
        )}
      </div>

      <div className="form-group">
        <label>Port</label>
        <input type="number" min={1} max={65535} value={form.port} onChange={ e => {update("port", e.target.value)}}/>
        {validationErrors.port && (
          <div style={{ color: "red" }}>{validationErrors.port}</div>
        )}
      </div>

      <div className="form-group">
        <label>Hosts (comma separated)</label>
        <input value={form.hosts} onChange={e => update("hosts", e.target.value)} />
        {validationErrors.hosts && (
          <div style={{ color: "red" }}>{validationErrors.hosts}</div>
        )}
      </div>

      <div className="form-group">
        <label>Policy</label>
        <select value={form.policyId} onChange={e => update("policyId", e.target.value)}>
          <option value="">Select policy…</option>
          {policies.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {validationErrors.policyId && (
          <div style={{ color: "red" }}>{validationErrors.policyId}</div>
        )}
      </div>

      <div className="form-group">
        <label>SSL Config</label>
        <select value={form.sslId} onChange={e => update("sslId", e.target.value)}>
          <option value="">Select SSL…</option>
          {ssls.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {validationErrors.sslId && (
          <div style={{ color: "red" }}>{validationErrors.sslId}</div>
        )}
      </div>

      <div className="form-group">
        <button onClick={submit}>Create</button>
      </div>
    </div>
  )
}