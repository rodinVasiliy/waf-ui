import { useEffect, useState } from "react"
import { fetchSSLs } from "../api/ssls"
import type { SSL } from "../types/SSL"

export function SSLsPage() {
  const [ssls, setSSLs] = useState<SSL[]>([])

  useEffect(() => {
    fetchSSLs()
      .then(setSSLs)
      .catch(console.error)
  }, [])

  return (
    <div>
      <h1>SSLs</h1>
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