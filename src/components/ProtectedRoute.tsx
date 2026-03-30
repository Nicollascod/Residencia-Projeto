import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { Role } from '../context/auth-types'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !auth.user.roles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
