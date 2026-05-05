import { Link, useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <main style={{ maxWidth: 640, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <h1>Não autorizado</h1>
      <p>Você não possui permissão para acessar esta página.</p>
      <Link to="/dashboard" style={{ color: '#1d4ed8' }}>
        Voltar ao painel
      </Link>
    </main>
  )
}

export default Unauthorized
