import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

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
  const [professor, setProfessor] = useState<Professor>({
    user: { username: '', name: '', email: '', roles: ['professor'] },
    availability: []
  })
  const isEditing = !!username

  useEffect(() => {
    if (isEditing) {
      const fetchProfessor = async () => {
        try {
          const response = await api.get(`/professors/${username}`)
          setProfessor(response.data)
        } catch (error) {
          console.error('Error fetching professor:', error)
        }
      }
      fetchProfessor()
    }
  }, [username, isEditing])

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
    try {
      if (isEditing) {
        await api.put(`/professors/${username}`, professor)
      } else {
        await api.post('/professors', professor)
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
      <h1>{isEditing ? 'Editar Professor' : 'Novo Professor'}</h1>
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
                disabled={isEditing}
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
                <>
                  <div>{day}</div>
                  <input
                    type="time"
                    value={avail.startTime}
                    onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                    style={{ padding: 4 }}
                  />
                  <input
                    type="time"
                    value={avail.endTime}
                    onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                    style={{ padding: 4 }}
                  />
                </>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
            Salvar
          </button>
          <button type="button" onClick={() => navigate('/professors')} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}

export default ProfessorForm