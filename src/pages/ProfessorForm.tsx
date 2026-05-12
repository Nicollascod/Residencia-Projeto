import { useState, useEffect, Fragment } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import mockApi from '../services/mockApi'

interface User {
  username: string
  name: string
  email: string
  roles: string[]
}

interface Availability {
  day: string
  startTime: string
  endTime: string
}

interface Professor {
  user: User
  availability: Availability[]
}

const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const ProfessorForm = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const [professor, setProfessor] = useState<Professor>({
    user: { username: '', name: '', email: '', roles: ['professor'] },
    availability: []
  })
  const [loading, setLoading] = useState(true)

  const isEditing = location.pathname.endsWith('/edit')
  const isViewing = !!username && !isEditing

  useEffect(() => {
    if (username) {
      // Buscar dados do professor do contexto de usuários
      const user = auth.users.find(u => u.username === username)
      if (user) {
        setProfessor({
          user: {
            username: user.username,
            name: user.name || user.username,
            email: user.email || '',
            roles: user.roles
          },
          availability: [] // Por enquanto sem disponibilidade
        })
        setLoading(false)
      } else {
        // Fallback para API se não encontrar no contexto
        const fetchProfessor = async () => {
          try {
            const response = await mockApi.get<Professor>(`/professors/${username}`)
            const fetched = response.data as any
            const normalizedProfessor: Professor = {
              user: fetched.user ?? {
                username: fetched.username ?? '',
                name: fetched.name ?? '',
                email: fetched.email ?? '',
                roles: fetched.roles ?? ['professor']
              },
              availability: Array.isArray(fetched.availability) ? fetched.availability : []
            }
            setProfessor(normalizedProfessor)
            setLoading(false)
          } catch (error) {
            console.error('Error fetching professor:', error)
            setLoading(false)
          }
        }
        fetchProfessor()
      }
    } else {
      // Novo professor
      setLoading(false)
    }
  }, [username, auth.users])

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfessor({
      ...professor,
      user: { ...professor.user, [e.target.name]: e.target.value }
    })
  }

  const handleAvailabilityChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    const updatedAvailability = professor.availability.map(avail =>
      avail.day === day ? { ...avail, [field]: value } : avail
    )

    // If day doesn't exist, add it
    if (!updatedAvailability.find(avail => avail.day === day)) {
      updatedAvailability.push({ day, startTime: field === 'startTime' ? value : '', endTime: field === 'endTime' ? value : '' })
    }

    setProfessor({ ...professor, availability: updatedAvailability })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isViewing) return // Não permitir submit na visualização
    
    try {
      if (isEditing) {
        // Atualizar usuário no contexto de autenticação
        await auth.updateUser(username!, {
          name: professor.user.name,
          email: professor.user.email
        })
        
        await mockApi.put(`/professors/${username}`, professor)
        // Atualizar lista de professores na página anterior
        const refreshProfessors = (location.state as any)?.refreshProfessors
        if (refreshProfessors) {
          refreshProfessors()
        }
      } else {
        await mockApi.post('/professors', professor)
        // Atualizar lista de professores na página anterior
        const refreshProfessors = (location.state as any)?.refreshProfessors
        if (refreshProfessors) {
          refreshProfessors()
        }
      }
      navigate('/professors')
    } catch (error) {
      console.error('Error saving professor:', error)
    }
  }

  const getAvailabilityForDay = (day: string) => {
    return professor.availability.find(avail => avail.day === day) || { day, startTime: '', endTime: '' }
  }

  return (
    <main style={{ maxWidth: 800, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/professors')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <h1>{isViewing ? 'Detalhes do Professor' : isEditing ? 'Editar Professor' : 'Novo Professor'}</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Campos do Usuário */}
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Informações do Usuário</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={professor.user.username}
                onChange={handleUserChange}
                required
                readOnly={isViewing}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div>
              <label htmlFor="name">Nome Completo:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={professor.user.name}
                onChange={handleUserChange}
                required
                readOnly={isViewing}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={professor.user.email}
                onChange={handleUserChange}
                required
                readOnly={isViewing}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Disponibilidade */}
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Disponibilidade Semanal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: 8, alignItems: 'center' }}>
            <div><strong>Dia</strong></div>
            <div><strong>Início</strong></div>
            <div><strong>Fim</strong></div>

            {daysOfWeek.map(day => {
              const avail = getAvailabilityForDay(day)
              return (
                <Fragment key={day}>
                  <div>{day}</div>
                  <input
                    type="time"
                    value={avail.startTime}
                    onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                    disabled={isViewing}
                    readOnly={isViewing}
                    style={{ padding: 4 }}
                  />
                  <input
                    type="time"
                    value={avail.endTime}
                    onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                    disabled={isViewing}
                    readOnly={isViewing}
                    style={{ padding: 4 }}
                  />
                </Fragment>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {isViewing ? (
            <>
              <button 
                type="button" 
                onClick={() => navigate(`/professors/${username}/edit`)} 
                style={{ padding: '10px 14px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: 4 }}
              >
                Editar
              </button>
              <button type="button" onClick={() => navigate('/professors')} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
                Voltar
              </button>
            </>
          ) : (
            <>
              <button type="submit" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
                Salvar
              </button>
              <button type="button" onClick={() => navigate('/professors')} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>
        </>
      )}
    </main>
  )
}

export default ProfessorForm