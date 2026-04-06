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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={auth.logout} style={{ padding: '10px 14px' }}>
            Sair
          </button>
          {auth.user?.roles.includes('coordenador-geral') && (
            <button
              onClick={auth.resetUsers}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                backgroundColor: '#ffc107',
                border: 'none',
                borderRadius: 4
              }}
            >
              Resetar Usuários
            </button>
          )}
        </div>
      </div>

      <nav style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/dashboard" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
          Painel
        </Link>
        {auth.user?.roles.includes('coordenador-geral') && (
          <Link to="/manage-users" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
            Gerenciar Usuários
          </Link>
        )}
        {(auth.user?.roles.includes('coordenador') || auth.user?.roles.includes('professor')) && (
          <>
            <Link to="/courses" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
              Cursos
            </Link>
            <Link to="/classes" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
              Turmas
            </Link>
            <Link to="/subjects" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
              Disciplinas
            </Link>
          </>
        )}
        {auth.user?.roles.includes('professor') && (
          <Link to="/students" style={{ padding: '10px 14px', border: '1px solid #ccc', textDecoration: 'none' }}>
            Alunos
          </Link>
        )}
      </nav>

      <section style={{ marginTop: 32 }}>
        <h2>Conteúdo protegido</h2>
        <p>Esta página está disponível apenas para usuários autenticados.</p>
        {auth.user?.roles.includes('coordenador-geral') && (
          <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 4, marginTop: 16 }}>
            <h3>Privilégios de Coordenador Geral</h3>
            <p>Você pode gerenciar todos os usuários do sistema, incluindo criação, edição e controle de acesso.</p>
            <p><strong>Usuários ativos:</strong> {auth.users.filter(u => u.active).length}</p>
            <p><strong>Total de usuários:</strong> {auth.users.length}</p>
          </div>
        )}
        {(auth.user?.roles.includes('coordenador') || auth.user?.roles.includes('professor')) && (
          <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 4, marginTop: 16 }}>
            <h3>Seus Cursos</h3>
            {auth.user?.courses && auth.user.courses.length > 0 ? (
              <ul>
                {auth.user.courses.map(course => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum curso associado.</p>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
