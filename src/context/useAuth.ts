import { useContext } from 'react'
import { AuthContext } from './auth-context'
import type { AuthContextType } from './auth-types'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context as AuthContextType
}
