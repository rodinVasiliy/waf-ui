import { useEffect, useState } from "react"
import { fetchActions } from "../api/actions"
import type { Action } from "../types/Action"

export function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    fetchActions()
      .then(setActions)
      .catch(console.error)
  }, [])

  return (
    <div>
      <h1>Actions</h1>
      <ul>
        {actions.map(action => (
          <li key={action.id}>
            {action.name}
          </li>
        ))}
      </ul>
    </div>
  )
}