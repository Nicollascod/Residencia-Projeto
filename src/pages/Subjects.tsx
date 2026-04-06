import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../services/api'

interface Course {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
  courseId: string
  professors: string[]
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const auth = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, coursesRes] = await Promise.all([
          api.get('/subjects'),
          api.get('/courses')
        ])
        setSubjects(subjectsRes.data)
        setCourses(coursesRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const filteredSubjects = selectedCourse ? subjects.filter(sub => sub.courseId === selectedCourse) : subjects

  return (
    <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Disciplinas</h1>
        {auth.user?.roles.includes('coordenador') && (
          <Link to="/subjects/new" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
            Nova Disciplina
          </Link>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="courseFilter">Filtrar por Curso:</label>
        <select
          id="courseFilter"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{ marginLeft: 8, padding: 8 }}
        >
          <option value="">Todos os Cursos</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filteredSubjects.map(subject => {
          const course = courses.find(c => c.id === subject.courseId)
          return (
            <div key={subject.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>{subject.name}</h3>
              <p>Curso: {course?.name}</p>
              <p>Professores: {subject.professors.join(', ')}</p>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Link to={`/subjects/${subject.id}`} style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
                  Ver Detalhes
                </Link>
                {auth.user?.roles.includes('coordenador') && (
                  <Link to={`/subjects/${subject.id}/edit`} style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: 4 }}>
                    Editar
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default Subjects