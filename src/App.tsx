import { Routes, Route, Navigate } from "react-router-dom"
import { WebAppsPage } from "./pages/WebAppsPage"
import {SSLsPage} from "./pages/SSLsPage"
import {ActionsPage} from "./pages/ActionsPage"
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/webapps" />} />

      <Route path="/webapps" element={<WebAppsPage />} />
      <Route path="/ssls" element={<SSLsPage />} />
      <Route path="/actions" element={<ActionsPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App
