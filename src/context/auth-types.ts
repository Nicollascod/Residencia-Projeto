export type Role = 'coordenador-geral' | 'coordenador' | 'professor'

export type User = {
  username: string
  roles: Role[]
}

export interface AuthContextType {
  user: User | null
  users: User[]
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  createUser: (username: string, password: string, roles: Role[]) => Promise<void>
}
