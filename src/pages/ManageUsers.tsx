import { type FormEvent, useState } from 'react'
import { useAuth } from '../context/useAuth'
import type { Role, User } from '../context/auth-types'

const availableRoles: Role[] = ['coordenador-geral', 'coordenador', 'professor']
const availableCourses = ['Matemática', 'Física', 'Química', 'Biologia', 'Português', 'História', 'Geografia', 'Inglês']

const ManageUsers = () => {
  const auth = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [filterRole, setFilterRole] = useState<Role | 'todos'>('todos')
  const [filterActive, setFilterActive] = useState<'todos' | 'ativo' | 'inativo'>('todos')

  const handleToggleRole = (role: Role) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        roles: editingUser.roles.includes(role)
          ? editingUser.roles.filter(r => r !== role)
          : [...editingUser.roles, role]
      })
    } else {
      setSelectedRoles((prev) =>
        prev.includes(role) ? prev.filter((item) => item !== role) : [...prev, role],
      )
    }
  }

  const handleToggleCourse = (course: string) => {
    if (editingUser) {
      const courses = editingUser.courses || []
      setEditingUser({
        ...editingUser,
        courses: courses.includes(course)
          ? courses.filter(c => c !== course)
          : [...courses, course]
      })
    } else {
      setSelectedCourses((prev) =>
        prev.includes(course) ? prev.filter((item) => item !== course) : [...prev, course],
      )
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    try {
      if (editingUser) {
        await auth.updateUser(editingUser.username, {
          roles: editingUser.roles,
          courses: editingUser.courses
        })
        setMessage(`Usuário ${editingUser.username} atualizado com sucesso.`)
        setEditingUser(null)
      } else {
        await auth.createUser(username, password, selectedRoles, selectedCourses)
        setMessage(`Usuário ${username} criado com sucesso.`)
        setUsername('')
        setPassword('')
        setSelectedRoles([])
        setSelectedCourses([])
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao salvar usuário')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setUsername(user.username)
    setPassword('')
    setSelectedRoles(user.roles)
    setSelectedCourses(user.courses || [])
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setUsername('')
    setPassword('')
    setSelectedRoles([])
    setSelectedCourses([])
  }

  const handleToggleActive = async (user: User) => {
    try {
      await auth.updateUser(user.username, { active: !user.active })
      setMessage(`Usuário ${user.username} ${!user.active ? 'ativado' : 'desativado'} com sucesso.`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao alterar status do usuário')
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.username}? Esta ação não pode ser desfeita.`)) {
      return
    }
    try {
      await auth.deleteUser(user.username)
      setMessage(`Usuário ${user.username} excluído com sucesso.`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao excluir usuário')
    }
  }

  const filteredUsers = auth.users.filter(user => {
    const roleMatch = filterRole === 'todos' || user.roles.includes(filterRole)
    const activeMatch = filterActive === 'todos' ||
      (filterActive === 'ativo' && user.active) ||
      (filterActive === 'inativo' && !user.active)
    return roleMatch && activeMatch
  })

  return (
    <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
      <h1>Gerenciar Usuários</h1>
      <p>Somente o Coordenador Geral pode criar, editar e gerenciar usuários.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, marginTop: 32 }}>
        {/* Formulário */}
        <div>
          <h2>{editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <label>
              Nome de usuário
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={!!editingUser}
                style={{ width: '100%', padding: 10, marginTop: 6 }}
              />
            </label>
            {!editingUser && (
              <label>
                Senha
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={{ width: '100%', padding: 10, marginTop: 6 }}
                />
              </label>
            )}
            <fieldset style={{ border: '1px solid #ddd', padding: 12 }}>
              <legend>Papéis</legend>
              {availableRoles.map((role) => (
                <label key={role} style={{ display: 'block', marginTop: 8 }}>
                  <input
                    type="checkbox"
                    checked={(editingUser ? editingUser.roles : selectedRoles).includes(role)}
                    onChange={() => handleToggleRole(role)}
                  />
                  {' '}
                  {role}
                </label>
              ))}
            </fieldset>
            <fieldset style={{ border: '1px solid #ddd', padding: 12 }}>
              <legend>Cursos</legend>
              {availableCourses.map((course) => (
                <label key={course} style={{ display: 'block', marginTop: 8 }}>
                  <input
                    type="checkbox"
                    checked={(editingUser ? (editingUser.courses || []) : selectedCourses).includes(course)}
                    onChange={() => handleToggleCourse(course)}
                  />
                  {' '}
                  {course}
                </label>
              ))}
            </fieldset>
            {message && <div style={{ color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ padding: '12px 16px', flex: 1 }}>
                {editingUser ? 'Atualizar usuário' : 'Criar usuário'}
              </button>
              {editingUser && (
                <button type="button" onClick={handleCancelEdit} style={{ padding: '12px 16px' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de usuários */}
        <div>
          <h2>Usuários Cadastrados</h2>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <label>
              Filtrar por papel:
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as Role | 'todos')}
                style={{ marginLeft: 8, padding: 4 }}
              >
                <option value="todos">Todos</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>
            <label>
              Status:
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as 'todos' | 'ativo' | 'inativo')}
                style={{ marginLeft: 8, padding: 4 }}
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </label>
          </div>

          {/* Lista */}
          <div style={{ border: '1px solid #ddd', borderRadius: 4 }}>
            {filteredUsers.length === 0 ? (
              <p style={{ padding: 16, textAlign: 'center', color: '#666' }}>
                Nenhum usuário encontrado
              </p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.username} style={{
                  padding: 16,
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{user.username}</strong>
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
                      Papéis: {user.roles.join(', ')}
                    </div>
                    {user.courses && user.courses.length > 0 && (
                      <div style={{ fontSize: '0.9em', color: '#666' }}>
                        Cursos: {user.courses.join(', ')}
                      </div>
                    )}
                    <div style={{
                      fontSize: '0.9em',
                      color: user.active ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{ padding: '6px 12px', fontSize: '0.9em' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(user)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.9em',
                        backgroundColor: user.active ? '#dc3545' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4
                      }}
                    >
                      {user.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.9em',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default ManageUsers
