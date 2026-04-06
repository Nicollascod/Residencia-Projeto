import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Course {
  id: string
  name: string
}

interface Class {
  id?: string
  name: string
  courseId: string
  year: number
}

const ClassForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cls, setCls] = useState<Class>({ name: '', courseId: '', year: new Date().getFullYear() })
  const [courses, setCourses] = useState<Course[]>([])
  const isEditing = !!id

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses')
        setCourses(response.data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()

    if (isEditing) {
      const fetchClass = async () => {
        try {
          const response = await api.get(`/classes/${id}`)
          setCls(response.data)
        } catch (error) {
          console.error('Error fetching class:', error)
        }
      }
      fetchClass()
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await api.put(`/classes/${id}`, cls)
      } else {
        await api.post('/classes', cls)
      }
      navigate('/classes')
    } catch (error) {
      console.error('Error saving class:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCls({ ...cls, [name]: name === 'year' ? parseInt(value) : value })
  }

  return (
    <main style={{ maxWidth: 600, margin: '48px auto', padding: 24 }}>
      <h1>{isEditing ? 'Editar Turma' : 'Nova Turma'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={cls.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div>
          <label htmlFor="courseId">Curso:</label>
          <select
            id="courseId"
            name="courseId"
            value={cls.courseId}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">Selecione um curso</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year">Ano:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={cls.year}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
            Salvar
          </button>
          <button type="button" onClick={() => navigate('/classes')} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}

export default ClassForm