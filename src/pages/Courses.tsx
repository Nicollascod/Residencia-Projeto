import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import mockApi from '../services/mockApi'

interface Course {
  id: string
  name: string
  description: string
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const response = await mockApi.get('/courses')
        setCourses(response.data as Course[])
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Cursos</h1>
        {(auth.user?.roles.some(role => role === 'coordenador' || role === 'coordenador-geral')) && (
          <Link
            to="/courses/new"
            style={{
              padding: '10px 14px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            ✚ Novo Curso
          </Link>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/courses/${course.id}`)}
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
              >
                Ver Detalhes
              </button>
              {auth.user?.roles.includes('coordenador') && (
                <button
                  onClick={() => navigate(`/courses/${course.id}/edit`)}
                  style={{ 
                    padding: '6px 12px', 
                    backgroundColor: '#ffc107', 
                    color: 'black', 
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0a800'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
                >
                  ✎ Editar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Courses