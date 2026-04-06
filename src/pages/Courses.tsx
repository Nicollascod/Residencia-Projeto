import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../services/api'

interface Course {
  id: string
  name: string
  description: string
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const auth = useAuth()

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses')
        setCourses(response.data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Cursos</h1>
        {auth.user?.roles.includes('coordenador-geral') && (
          <Link to="/courses/new" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
            Novo Curso
          </Link>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Link to={`/courses/${course.id}`} style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
                Ver Detalhes
              </Link>
              {auth.user?.roles.includes('coordenador-geral') && (
                <Link to={`/courses/${course.id}/edit`} style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: 4 }}>
                  Editar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Courses