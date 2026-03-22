import { useEffect, useState } from "react"
import { createSSL, fetchSSLFiles } from "../api/ssls"
import { useNavigate } from "react-router-dom"
import type { ValidationErrorResponse } from "../types/ValidationErrorResponse"

export function SSLCreatePage() {
  const [certs, setCertFiles] = useState<string[]>([])
  const [keys, setKeyFiles] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: "",
    certFile: "",
    keyFile: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const data = await fetchSSLFiles();
    setCertFiles(data.certs);
    setKeyFiles(data.keys);
  }


  function update(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }));
    setValidationErrors(prev => {
      const copy = {...prev}
      delete copy[field]
      return copy
    })
  }

    async function submit() {
      setValidationErrors({}); // очистили ошибки перед отправкой
  
      try {
        await createSSL(form)
        alert("Created!")
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

      {/* Глобальные ошибки */}
      {Object.entries(validationErrors).map(([field, message]) => (
        <p key={field} style={{ color: "red" }}>
          {field}: {message}
        </p>
      ))}

      <label>Name</label>
      <input value={form.name} onChange={e => update("name", e.target.value)} />

      <label>Certificate file</label>
      <select value={form.certFile} onChange={e => update("cert", e.target.value)}>
        <option value="">Select certificate…</option>
        {certs.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <label>Key file</label>
      <select value={form.keyFile} onChange={e => update("key", e.target.value)}>
        <option value="">Select key…</option>
        {keys.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <button onClick={submit}>Create</button>
    </div>
  )
}