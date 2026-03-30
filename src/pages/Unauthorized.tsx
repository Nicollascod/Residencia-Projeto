import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <main style={{ maxWidth: 640, margin: '48px auto', padding: 24 }}>
      <h1>Não autorizado</h1>
      <p>Você não possui permissão para acessar esta página.</p>
      <Link to="/dashboard" style={{ color: '#1d4ed8' }}>
        Voltar ao painel
      </Link>
    </main>
  )
}

export default Unauthorized
