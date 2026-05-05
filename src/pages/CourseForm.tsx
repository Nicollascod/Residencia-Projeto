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
  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        try {
          const response = await mockApi.get<Course>(`/courses/${id}`)
          setCourse(response.data)
        } catch (error) {
          console.error('Error fetching course:', error)
        }
      }
      fetchCourse()
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await mockApi.put(`/courses/${id}`, course)
      } else {
        await mockApi.post('/courses', course)
      }
      navigate('/courses')
    } catch (error) {
      console.error('Error saving course:', error)
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
            style={{ width: '100%', padding: 8, marginTop: 4 }}
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
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
            Salvar
          </button>
          <button type="button" onClick={() => navigate('/courses')} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}

export default CourseForm