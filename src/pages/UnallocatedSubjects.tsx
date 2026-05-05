import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import mockApi from '../services/mockApi'

interface Subject {
  id: number
  nome?: string
  name?: string
  curso: number
  professores?: (number | string)[]
  professors?: (number | string)[]
}

interface ScheduledClass {
  disciplina: string
  periodo_letivo: string
}

interface User {
  id?: number
  username?: string
  first_name?: string
  papel?: string
  ativo?: boolean
}

const UnallocatedSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([])
  const [professors, setProfessors] = useState<User[]>([])
  const [semester, setSemester] = useState('2024.1')
  const [year, setYear] = useState(2024)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const semesters = ['2023.1', '2023.2', '2024.1', '2024.2', '2025.1', '2025.2']
  const years = [2023, 2024, 2025, 2026]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const subjectsResponse = await mockApi.get<Subject[]>('/disciplinas')
        const scheduledResponse = await mockApi.get<ScheduledClass[]>('/aulas')
        const professorsResponse = await mockApi.get<User[]>('/gerenciar')
        setSubjects(subjectsResponse.data)
        setScheduledClasses(scheduledResponse.data)
        setProfessors(professorsResponse.data.filter((user: User) => user.papel === 'professor'))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [semester, year])

  const getSubjectName = (subject: Subject) => subject.nome || subject.name || 'Nome não informado'
  const getSubjectProfessors = (subject: Subject) => subject.professores ?? subject.professors ?? []

  const getUnallocatedSubjects = () => {
    const allocatedSubjectIds = new Set(scheduledClasses.filter(sc => sc.periodo_letivo === semester).map(sc => sc.disciplina))
    return subjects.filter(subject => !allocatedSubjectIds.has(String(subject.id)))
  }

  const getProfessorNames = (professorIds: (number | string)[]) => {
    return professorIds
      .map(id => {
        const professor = professors.find(p => p.id === id || p.username === id || p.first_name === id)
        return professor?.first_name || professor?.username || 'N/A'
      })
      .join(', ')
  }

  const unallocatedSubjects = getUnallocatedSubjects()

  if (loading) {
    return (
      <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
        <h1>Disciplinas Não Alocadas</h1>
        <div style={{ textAlign: 'center', padding: 24 }}>Carregando...</div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <h1>Disciplinas Não Alocadas</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <div>
          <label htmlFor="semester">Período Letivo:</label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={{ marginLeft: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          >
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year">Ano:</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{ marginLeft: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: '#856404' }}>
          📋 Disciplinas sem aulas agendadas no período {semester} de {year}
        </h3>
        <p style={{ margin: '8px 0 0 0', color: '#856404' }}>
          Total: {unallocatedSubjects.length} disciplina(s)
        </p>
      </div>

      {unallocatedSubjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 8 }}>
          <h3 style={{ color: '#155724', margin: 0 }}>✅ Todas as disciplinas estão alocadas!</h3>
          <p style={{ color: '#155724', margin: '8px 0 0 0' }}>
            Não há disciplinas sem aulas agendadas para o período selecionado.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
          {unallocatedSubjects.map(subject => (
            <div
              key={subject.id}
              style={{
                border: '1px solid #ffc107',
                borderRadius: 8,
                padding: 16,
                backgroundColor: '#fff3cd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', color: '#856404' }}>{getSubjectName(subject)}</h3>
              <p style={{ margin: '4px 0', color: '#856404' }}>
                <strong>Professores:</strong> {getSubjectProfessors(subject).length > 0 ? getProfessorNames(getSubjectProfessors(subject)) : 'Nenhum professor atribuído'}
              </p>
              <div style={{
                marginTop: 12,
                padding: '8px',
                backgroundColor: '#856404',
                color: 'white',
                borderRadius: 4,
                textAlign: 'center',
                fontSize: '14px'
              }}>
                ⚠️ Pendente de Alocação
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default UnallocatedSubjects