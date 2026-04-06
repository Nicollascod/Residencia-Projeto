import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './auth-context'
import type { Role, User, AuthContextType } from './auth-types'

type StoredUser = User & {
  password: string
}

const STORAGE_USER_KEY = 'auth_user'
const STORAGE_USERS_KEY = 'auth_users'

const defaultUsers: StoredUser[] = [
  {
    username: 'coordenador-geral',
    password: 'geral123',
    roles: ['coordenador-geral'],
    active: true,
    courses: [],
  },
  {
    username: 'coordenador',
    password: 'coord123',
    roles: ['coordenador'],
    active: true,
    courses: ['Matemática', 'Física'],
  },
  {
    username: 'professor',
    password: 'prof123',
    roles: ['professor'],
    active: true,
    courses: ['Português', 'História'],
  },
  {
    username: 'multi',
    password: 'multi123',
    roles: ['coordenador', 'professor'],
    active: true,
    courses: ['Química', 'Biologia'],
  },
]

function loadStoredUsers(): StoredUser[] {
  const raw = localStorage.getItem(STORAGE_USERS_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers))
    return defaultUsers
  }

  try {
    const parsed = JSON.parse(raw) as StoredUser[]
    return Array.isArray(parsed) ? parsed : defaultUsers
  } catch {
    return defaultUsers
  }
}

function loadStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadStoredUser())
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>(loadStoredUsers)

  useEffect(() => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(storedUsers))
  }, [storedUsers])

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_USER_KEY)
    }
  }, [user])

  const login = async (username: string, password: string) => {
    const matched = storedUsers.find(
      (item) => item.username.toLowerCase() === username.toLowerCase(),
    )

    if (!matched || matched.password !== password) {
      return Promise.reject(new Error('Usuário ou senha inválidos'))
    }

    if (!matched.active) {
      return Promise.reject(new Error('Conta desativada'))
    }

    const loggedUser: User = {
      username: matched.username,
      roles: matched.roles,
      active: matched.active,
      courses: matched.courses,
    }

    setUser(loggedUser)
  }

  const logout = () => {
    setUser(null)
  }

  const createUser = async (username: string, password: string, roles: Role[], courses: string[] = []) => {
    const existingUser = storedUsers.find(
      (item) => item.username.toLowerCase() === username.toLowerCase(),
    )

    if (existingUser) {
      return Promise.reject(new Error('Já existe um usuário com esse nome'))
    }

    if (!username.trim() || !password.trim() || roles.length === 0) {
      return Promise.reject(new Error('Preencha todos os campos e selecione ao menos um papel'))
    }

    const newUser: StoredUser = {
      username: username.trim(),
      password: password.trim(),
      roles,
      active: true,
      courses,
    }

    setStoredUsers((prev) => [...prev, newUser])
  }

  const updateUser = async (username: string, updates: Partial<Pick<User, 'roles' | 'active' | 'courses'>>) => {
    const userIndex = storedUsers.findIndex(
      (item) => item.username.toLowerCase() === username.toLowerCase(),
    )

    if (userIndex === -1) {
      return Promise.reject(new Error('Usuário não encontrado'))
    }

    setStoredUsers((prev) => {
      const updated = [...prev]
      updated[userIndex] = { ...updated[userIndex], ...updates }
      return updated
    })

    // Update current user if it's the one being updated
    if (user?.username.toLowerCase() === username.toLowerCase()) {
      setUser((prev) => prev ? { ...prev, ...updates } : null)
    }
  }

  const deleteUser = async (username: string) => {
    const userIndex = storedUsers.findIndex(
      (item) => item.username.toLowerCase() === username.toLowerCase(),
    )

    if (userIndex === -1) {
      return Promise.reject(new Error('Usuário não encontrado'))
    }

    // Prevent deleting the last coordinator-geral
    const remainingCoordenadoresGerais = storedUsers.filter(
      (u, i) => i !== userIndex && u.roles.includes('coordenador-geral')
    )
    if (remainingCoordenadoresGerais.length === 0) {
      return Promise.reject(new Error('Não é possível excluir o último Coordenador Geral'))
    }

    setStoredUsers((prev) => prev.filter((_, i) => i !== userIndex))

    // Logout if deleting current user
    if (user?.username.toLowerCase() === username.toLowerCase()) {
      setUser(null)
    }
  }

  const resetUsers = () => {
    setStoredUsers(defaultUsers)
    setUser(null)
  }

  const contextValue: AuthContextType = {
    user,
    users: storedUsers.map((item) => ({
      username: item.username,
      roles: item.roles,
      active: item.active,
      courses: item.courses,
    })),
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    resetUsers,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
