import { useEffect, useState } from "react"
import { fetchWebApps } from "../api/webapps"
import type { WebApp } from "../types/WebApp"

export function WebAppsPage() {
  const [apps, setApps] = useState<WebApp[]>([])

  useEffect(() => {
    fetchWebApps()
      .then(setApps)
      .catch(console.error)
  }, [])

  return (
    <div>
      <h1>Web Apps</h1>
      <ul>
        {apps.map(app => (
          <li key={app.id}>
            {app.name} → {app.upstream}
          </li>
        ))}
      </ul>
    </div>
  )
}