import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

const RecoverPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      // Simulação de envio de email de recuperação
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.')
    } catch {
      setMessage('Erro ao enviar email de recuperação.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '48px auto', padding: 24 }}>
      <h1>Recuperar Senha</h1>
      <p>Digite seu email para receber instruções de recuperação de senha.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoFocus
            style={{ width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>

        {message && (
          <div style={{
            color: message.includes('Erro') ? 'red' : 'green',
            padding: 12,
            border: `1px solid ${message.includes('Erro') ? 'red' : 'green'}`,
            borderRadius: 4
          }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 16px',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Enviando...' : 'Enviar instruções'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
          Voltar ao login
        </Link>
      </div>
    </main>
  )
}

export default RecoverPassword