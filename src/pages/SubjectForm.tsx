import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Course {
  id: string
  name: string
}

interface User {
  username: string
  roles: string[]
}

interface Subject {
  id?: string
  name: string
  courseId: string
  professors: string[]
}

const SubjectForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [subject, setSubject] = useState<Subject>({ name: '', courseId: '', professors: [] })
  const [courses, setCourses] = useState<Course[]>([])
  const [professors, setProfessors] = useState<User[]>([])
  const isEditing = !!id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes] = await Promise.all([
          api.get('/courses'),
          api.get('/users')
        ])
        setCourses(coursesRes.data)
        setProfessors(usersRes.data.filter((user: User) => user.roles.includes('professor')))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()

    if (isEditing) {
      const fetchSubject = async () => {
        try {
          const response = await api.get(`/subjects/${id}`)
          setSubject(response.data)
        } catch (error) {
          console.error('Error fetching subject:', error)
        }
      }
      fetchSubject()
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await api.put(`/subjects/${id}`, subject)
      } else {
        await api.post('/subjects', subject)
      }
      navigate('/subjects')
    } catch (error) {
      console.error('Error saving subject:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSubject({ ...subject, [e.target.name]: e.target.value })
  }

  const handleProfessorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value)
    setSubject({ ...subject, professors: selected })
  }

  return (
    <main style={{ maxWidth: 600, margin: '48px auto', padding: 24 }}>
      <h1>{isEditing ? 'Editar Disciplina' : 'Nova Disciplina'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={subject.name}
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
            value={subject.courseId}
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
          <label htmlFor="professors">Professores (múltipla seleção):</label>
          <select
            id="professors"
            name="professors"
            multiple
            value={subject.professors}
            onChange={handleProfessorChange}
            style={{ width: '100%', padding: 8, marginTop: 4, height: 120 }}
          >
            {professors.map(prof => (
              <option key={prof.username} value={prof.username}>{prof.username}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
            Salvar
          </button>
          <button type="button" onClick={() => navigate('/subjects')} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}

export default SubjectForm