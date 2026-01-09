import { useEffect, useState } from "react";
import { createWebApp } from "../api/webapps";
import { fetchSSLs } from "../api/ssls";
import { fetchPolicies } from "../api/policies";
import { useNavigate } from "react-router-dom"
import type { Policy } from "../types/Policy";
import type { SSL } from "../types/SSL";
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse";

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
        setForm(f => ({...f, [field]:value }))
    }
    
    async function  submit() {
        const payload = {
            ...form,
            hosts: form.hosts.split(",").map(h => h.trim)
        }

        try {
          await createWebApp(payload)
          alert("Created!")
          navigate("/webapps")
        } catch (err: unknown) {
          const e = err as ValidationErrorResponse
          if (e.code === "validation_error") {
            setValidationErrors(e.fields)
            return
          }
          alert("Unexpected error")
        }
        
    }

    Object.entries(validationErrors).map(([field, message]) => (
      <p key={field} style={{color:"red"}}>
        {field}: {message}
      </p>
    ))


    return (
    <div>
      <h1>Create WebApp</h1>

      <label>Name</label>
      <input value={form.name} onChange={e => update("name", e.target.value)} />

      <label>Upstream</label>
      <input value={form.upstream} onChange={e => update("upstream", e.target.value)} />

      <label>Port</label>
      <input type="number" value={form.port} onChange={e => update("port", Number(e.target.value))} />

      <label>Hosts (comma separated)</label>
      <input value={form.hosts} onChange={e => update("hosts", e.target.value)} />

      <label>Policy</label>
      <select value={form.policyId} onChange={e => update("policyId", e.target.value)}>
        <option value="">Select policy…</option>
        {policies.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <label>SSL Config</label>
      <select value={form.sslId} onChange={e => update("sslId", e.target.value)}>
        <option value="">Select SSL…</option>
        {ssls.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <button onClick={submit}>Create</button>
    </div>
  )


}