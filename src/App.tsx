import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ManageUsers from './pages/ManageUsers'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["coordenador-geral"]} />}>
        <Route path="/manage-users" element={<ManageUsers />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App;

