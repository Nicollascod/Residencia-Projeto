import { type FormEvent, useState } from 'react'
import { useAuth } from '../context/useAuth'
import type { Role } from '../context/auth-types'

const availableRoles: Role[] = ['coordenador-geral', 'coordenador', 'professor']

const ManageUsers = () => {
  const auth = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
  const [message, setMessage] = useState('')

  const handleToggleRole = (role: Role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((item) => item !== role) : [...prev, role],
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    try {
      await auth.createUser(username, password, selectedRoles)
      setMessage(`Usuário ${username} criado com sucesso.`)
      setUsername('')
      setPassword('')
      setSelectedRoles([])
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao criar usuário')
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
      <h1>Gerenciar Usuários</h1>
      <p>Somente o Coordenador Geral pode criar coordenadores e professores.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <label>
          Nome de usuário
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>
        <fieldset style={{ border: '1px solid #ddd', padding: 12 }}>
          <legend>Papéis</legend>
          {availableRoles.map((role) => (
            <label key={role} style={{ display: 'block', marginTop: 8 }}>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => handleToggleRole(role)}
              />
              {' '}
              {role}
            </label>
          ))}
        </fieldset>
        {message && <div style={{ color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</div>}
        <button type="submit" style={{ padding: '12px 16px' }}>
          Criar usuário
        </button>
      </form>

      <section style={{ marginTop: 32 }}>
        <h2>Usuários existentes</h2>
        <ul>
          {auth.users.map((item) => (
            <li key={item.username}>
              {item.username} — {item.roles.join(', ')}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default ManageUsers
