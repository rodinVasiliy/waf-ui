import { Routes, Route, Navigate } from "react-router-dom"
import { WebAppsPage } from "./pages/WebAppsPage"
import { WebAppCreatePage } from "./pages/WebAppCreatePage"
import {SSLsPage} from "./pages/SSLsPage"
import {ActionsPage} from "./pages/ActionsPage"
import { SSLCreatePage } from "./pages/SSLCreatePage"
import './App.css'
import { AdminLayout } from "./layout/AdminLayout"
import { SSLEditPage } from "./pages/SSLEditPage"
import { WebAppEditPage } from "./pages/WebAppEditPage"
import {PoliciesPage} from "./pages/PoliciesPage"
import { PolicyEditPage } from "./pages/PolicyEditPage"
import { RuleDetailPage } from "./pages/EditRulePage"
import { RulesListPage } from "./pages/RulePage"

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/webapps" />} />

        <Route path="/webapps" element={<WebAppsPage />} />
        <Route path="/ssls" element={<SSLsPage />} />
        <Route path="/actions" element={<ActionsPage />} />
        <Route path="/rules" element={< RulesListPage/>} />
        
        
        <Route path="/webapps/new" element={<WebAppCreatePage />} />
        <Route path="/ssls/new" element={<SSLCreatePage />} />

        <Route path="/ssls/:id/edit" element={<SSLEditPage />} />
        <Route path="/webapps/:id/edit" element={<WebAppEditPage />} />
        <Route path="/rules/:id/edit" element={<RuleDetailPage />} />

        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/policies/:id/edit" element={<PolicyEditPage />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>

    </Routes>
  )
}

export default App
