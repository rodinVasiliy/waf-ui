import React from "react"
import ReactDOM from "react-dom/client"
import { WebAppsPage } from "./pages/WebAppsPage"

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <WebAppsPage />
  </React.StrictMode>
)