import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      await auth.login(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar')
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '48px auto', padding: 24 }}>
      <h1>Entrar</h1>
      <p>Use uma conta existente para acessar as rotas protegidas.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <label>
          Usuário
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoFocus
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
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" style={{ padding: '12px 16px' }}>
          Fazer login
        </button>
      </form>
      <section style={{ marginTop: 28 }}>
        <strong>Contas de teste:</strong>
        <ul>
          <li>coordenador-geral / geral123</li>
          <li>coordenador / coord123</li>
          <li>professor / prof123</li>
          <li>multi / multi123</li>
        </ul>
      </section>
    </main>
  )
}

export default Login
