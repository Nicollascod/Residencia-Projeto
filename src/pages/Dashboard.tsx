import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Dashboard = () => {
  const auth = useAuth()

  return (
    <main style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h1>Painel</h1>
          <p>Bem-vindo, <strong>{auth.user?.username}</strong>.</p>
          <p>Papéis: {auth.user?.roles.join(', ')}</p>
        </div>
        <button onClick={auth.logout} style={{ padding: '10px 14px' }}>
          Sair
        </button>
      </div>

      <nav style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/dashboard" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
          Painel
        </Link>
        {auth.user?.roles.includes('coordenador-geral') && (
          <Link to="/manage-users" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
            Criar usuários
          </Link>
        )}
      </nav>

      <section style={{ marginTop: 32 }}>
        <h2>Conteúdo protegido</h2>
        <p>Esta página está disponível apenas para usuários autenticados.</p>
        {auth.user?.roles.includes('coordenador-geral') && (
          <p>Você é Coordenador Geral e pode gerenciar usuários.</p>
        )}
      </section>
    </main>
  )
}

export default Dashboard
