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
  },
  {
    username: 'coordenador',
    password: 'coord123',
    roles: ['coordenador'],
  },
  {
    username: 'professor',
    password: 'prof123',
    roles: ['professor'],
  },
  {
    username: 'multi',
    password: 'multi123',
    roles: ['coordenador', 'professor'],
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

    const loggedUser: User = {
      username: matched.username,
      roles: matched.roles,
    }

    setUser(loggedUser)
  }

  const logout = () => {
    setUser(null)
  }

  const createUser = async (username: string, password: string, roles: Role[]) => {
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
    }

    setStoredUsers((prev) => [...prev, newUser])
  }

  const contextValue: AuthContextType = {
    user,
    users: storedUsers.map((item) => ({
      username: item.username,
      roles: item.roles,
    })),
    login,
    logout,
    createUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
