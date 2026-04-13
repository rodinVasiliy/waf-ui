import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchSSLs } from "../api/ssls";
import { fetchPolicies } from "../api/policies";
import { getWebApp, updateWebApp } from "../api/webapps";

import type { Policy } from "../types/Policy";
import type { SSL } from "../types/SSL";

import "../App.css";

export function WebAppEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [ssls, setSSLs] = useState<SSL[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: "",
    policyId: "",
    sslId: "",
    upstream: "",
    port: "",
    hosts: "",
  });

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const [p, s, webapp] = await Promise.all([
        fetchPolicies(),
        fetchSSLs(),
        getWebApp(id!)
      ]);

      setPolicies(p);
      setSSLs(s);

      setForm({
        name: webapp.name,
        policyId: webapp.policyId || "",
        sslId: webapp.sslId || "",
        upstream: webapp.upstream,
        port: String(webapp.port),
        hosts: (webapp.hosts || []).join(", "),
      });

    } catch (e) {
      alert("Failed to load webapp");
    } finally {
      setLoading(false)
    }
  }

  function update(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }));

    setValidationErrors(prev => {
      const copy = { ...prev }
      delete copy[field]
      return copy
    })
  }

  async function submit() {

    const errors: Record<string, string> = {}

    if (form.port === "") {
      errors.port = "Port is required"
    } else if (isNaN(Number(form.port))) {
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
      hosts: form.hosts.split(",").map((h: string) => h.trim())
    };

    try {
      await updateWebApp(id!, payload);
      alert("Updated!");
      navigate("/webapps");
    } catch (err: any) {
      if (err.code === "validation_error") {
        setValidationErrors(err.fields)
        return
      }
      alert("Unexpected error");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!id) return <div>No ID</div>;

  return (
    <div className="form-container">
      <h1>Edit WebApp</h1>

      {Object.entries(validationErrors).map(([field, message]) => (
        <p key={field} style={{ color: "red" }}>
          {field}: {message}
        </p>
      ))}

      <div className="form-group">
        <label>Name</label>
        <input value={form.name} onChange={e => update("name", e.target.value)} />
      </div>

      <div className="form-group">
        <label>Upstream</label>
        <input value={form.upstream} onChange={e => update("upstream", e.target.value)} />
      </div>

      <div className="form-group">
        <label>Port</label>
        <input type="number" min={1} max={65535} value={form.port} onChange={ e => {update("port", e.target.value)}}/>
      </div>

      <div className="form-group">
        <label>Hosts (comma separated)</label>
        <input value={form.hosts} onChange={e => update("hosts", e.target.value)} />
      </div>

      <div className="form-group">
        <label>Policy</label>
        <select value={form.policyId} onChange={e => update("policyId", e.target.value)}>
          <option value="">Select policy…</option>
          {policies.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>SSL Config</label>
        <select value={form.sslId} onChange={e => update("sslId", e.target.value)}>
          <option value="">Select SSL…</option>
          {ssls.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <button onClick={submit}>Save</button>
      </div>
    </div>
  );
}