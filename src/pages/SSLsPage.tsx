import { useEffect, useState } from "react"
import { fetchSSLs } from "../api/ssls"
import type { SSL } from "../types/SSL"
import { useNavigate } from "react-router-dom"
import { deleteSSL } from "../api/ssls"

export function SSLsPage() {
  const [ssls, setSSLs] = useState<SSL[]>([])

  useEffect(() => {
    fetchSSLs()
      .then(setSSLs)
      .catch(console.error)
  }, [])

  const navigate = useNavigate()

    async function onDelete(id: string) {
      if (!confirm("Delete this ssl config?")) return
  
      try {
        await deleteSSL(id)
        setSSLs(prev => prev.filter(a => a.id !== id))
      } catch (e) {
        console.error(e)
        alert("Delete failed:")
      }
    }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>SSL Configurations</h1>
        <button onClick={() => navigate("/ssls/new")}>
          + Create SSL
        </button>
      </div>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>CertFile</th>
            <th>KeyFile</th>
          </tr>
        </thead>
        <tbody>
          {ssls.map(ssl => (
            <tr key={ssl.id}>
              <td>{ssl.name}</td>
              <td>{ssl.cert}</td>
              <td>{ssl.key}</td>
              <td>
                <button onClick={() => navigate(`/ssl/${ssl.id}/edit`)}>
                  Edit
                </button>
                {" "}
                <button onClick={() => onDelete(ssl.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}