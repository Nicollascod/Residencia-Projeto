import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import mockApi from '../services/mockApi'

interface User {
  username: string
  name: string
  email: string
  roles: string[]
}

const Professors = () => {
  const [professors, setProfessors] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await mockApi.get<User[]>('/users')
        const profs = response.data.filter((user: User) => user.roles.includes('professor'))
        setProfessors(profs)
      } catch (error) {
        console.error('Error fetching professors:', error)
      }
    }
    fetchProfessors()
  }, [])

  const filteredProfessors = professors.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Professores</h1>
        {auth.user?.roles.includes('coordenador-geral') && (
          <Link to="/professors/new" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
            Novo Professor
          </Link>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Buscar por nome, username ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
        {filteredProfessors.map(prof => (
          <div key={prof.username} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{prof.name}</h3>
            <p><strong>Username:</strong> {prof.username}</p>
            <p><strong>Email:</strong> {prof.email}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Link to={`/professors/${prof.username}`} style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
                Ver Detalhes
              </Link>
              {auth.user?.roles.includes('coordenador-geral') && (
                <Link to={`/professors/${prof.username}/edit`} style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: 4 }}>
                  Editar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProfessors.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: 24 }}>Nenhum professor encontrado.</p>
      )}
    </main>
  )
}

export default Professors