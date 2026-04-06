export type Role = 'coordenador-geral' | 'coordenador' | 'professor'

export type User = {
  username: string
  roles: Role[]
  active: boolean
  courses?: string[]
}

export interface AuthContextType {
  user: User | null
  users: User[]
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  createUser: (username: string, password: string, roles: Role[], courses?: string[]) => Promise<void>
  updateUser: (username: string, updates: Partial<Pick<User, 'roles' | 'active' | 'courses'>>) => Promise<void>
  deleteUser: (username: string) => Promise<void>
  resetUsers: () => void
}
