import { useEffect, useState } from "react"
import { fetchSSLs } from "../api/ssls"
import type { SSL } from "../types/SSL"
import { useNavigate } from "react-router-dom"

export function SSLsPage() {
  const [ssls, setSSLs] = useState<SSL[]>([])

  useEffect(() => {
    fetchSSLs()
      .then(setSSLs)
      .catch(console.error)
  }, [])

  const navigate = useNavigate()

  return (
    <div>
      <h1>SSLs</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Web Apps</h1>
        <button onClick={() => navigate("/ssls/new")}>
          + Create SSL
        </button>
      </div>
      <ul>
        {ssls.map(ssl => (
          <li key={ssl.id}>
            {ssl.name} : "cert": {ssl.cert}, "key": {ssl.key}
          </li>
        ))}
      </ul>
    </div>
  )
}