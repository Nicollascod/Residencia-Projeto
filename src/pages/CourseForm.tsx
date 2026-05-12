import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import mockApi from '../services/mockApi'

interface Course {
  id?: string
  name: string
  description: string
}

const CourseForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course>({ name: '', description: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isEditing = id && id !== 'new'

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        try {
          setLoading(true)
          const response = await mockApi.get<Course>(`/courses/${id}`)
          setCourse(response.data)
        } catch (error) {
          console.error('Error fetching course:', error)
          setError('Erro ao carregar curso')
        } finally {
          setLoading(false)
        }
      }
      fetchCourse()
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!course.name.trim()) {
      setError('Nome do curso é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      if (isEditing) {
        await mockApi.put(`/courses/${id}`, course)
      } else {
        await mockApi.post('/courses', course)
      }
      
      navigate('/courses')
    } catch (error) {
      console.error('Error saving course:', error)
      setError('Erro ao salvar curso')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourse({ ...course, [e.target.name]: e.target.value })
  }

  return (
    <main style={{ maxWidth: 600, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/courses')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <h1>{isEditing ? 'Editar Curso' : 'Novo Curso'}</h1>
      
      {error && (
        <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c2c7', color: '#842029', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {loading && !isEditing ? (
        <div style={{ textAlign: 'center', padding: 24 }}>Carregando...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={course.name}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label htmlFor="description">Descrição:</label>
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '10px 14px', 
                backgroundColor: loading ? '#ccc' : '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/courses')}
              disabled={loading}
              style={{ 
                padding: '10px 14px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  )
}

export default CourseForm