import { useEffect, useState } from "react"
import { fetchPolicies } from "../api/policies"
import { useNavigate } from "react-router-dom"
import { deletePolicy } from "../api/policies"
import type { PolicyListItem } from "../types/Policy"
import "../App.css"

export function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyListItem[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    fetchPolicies()
      .then(setPolicies)
      .catch(console.error)
  }, [])

  async function onDelete(id: string) {
    if (!confirm("Delete this policy")) return

    try {
      await deletePolicy(id)
      setPolicies(prev => prev.filter(a => a.id !== id))
    } catch (e: any) {
      console.error(e)

      if (e.code === "policy_in_use") {
        alert(`Cannot delete. Used in: ${e.webapps.join(", ")}`)
        return
      }

      alert("Delete failed")
    }
  }


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Policies</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => navigate("/policies/new")}>
          + Create Policy
        </button>
      </div>
      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>White List</th>
            <th>Webapps</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(policy => (
            <tr key={policy.id}>
              <td>{policy.name}</td>
              <td>{policy.wl.join(", ")}</td>
              <td>{policy.webapps.join(", ")}</td>
              <td>
                <button onClick={() => navigate(`/policies/${policy.id}/edit`)}>
                  Edit
                </button>
                {" "}
                <button onClick={() => onDelete(policy.id)}>
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