import { useEffect, useState } from "react"
import { fetchActions } from "../api/actions"
import type { Action } from "../types/Action"
import "../App.css"

export function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    fetchActions()
      .then(setActions)
      .catch(console.error)
  }, [])

  return (
    <div className="form-container">
      <h1>Actions</h1>

      {actions.map(action => (
        <div key={action.id} className="form-group">
          {action.name}
        </div>
      ))}
    </div>
  )
}