import { useEffect, useState } from "react"
import { fetchWebApps, deleteWebApp } from "../api/webapps"
import type { WebApp } from "../types/WebApp"
import { useNavigate } from "react-router-dom"

export function WebAppsPage() {
  const [apps, setApps] = useState<WebApp[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      const data = await fetchWebApps()
      setApps(data)
    } catch (e) {
      console.error(e)
      alert("Failed to load web apps")
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this web app?")) return

    try {
      await deleteWebApp(id)
      setApps(prev => prev.filter(a => a.id !== id))
    } catch (e) {
      console.error(e)
      alert("Delete failed")
    }
  }

  return (
    <div>
      {/* Заголовок + Create */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Web Apps</h1>
        <button onClick={() => navigate("/webapps/new")}>
          + Create WebApp
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table border={1} cellPadding={8} cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Policy</th>
              <th>SSL</th>
              <th>Upstream</th>
              <th>Port</th>
              <th>Hosts</th>
            </tr>
          </thead>

          <tbody>
            {apps.map(app => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>{app.policyName}</td>
                <td>{app.sslName}</td>
                <td>{app.upstream}</td>
                <td>{app.port}</td>
                <td>{app.hosts.join(", ")}</td>
                <td>
                  <button onClick={() => navigate(`/webapps/${app.id}/edit`)}>
                    Edit
                  </button>
                  {" "}
                  <button onClick={() => onDelete(app.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {apps.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No web apps
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}