import { useState } from 'react'
import ScheduleGrid from '../components/ScheduleGrid'

const Schedule = () => {
  const [viewType, setViewType] = useState<'class' | 'professor' | 'room'>('class')
  const [semester, setSemester] = useState('2024.1')
  const [year, setYear] = useState(2024)

  const semesters = ['2023.1', '2023.2', '2024.1', '2024.2', '2025.1', '2025.2']
  const years = [2023, 2024, 2025, 2026]

  return (
    <main style={{ maxWidth: 1400, margin: '48px auto', padding: 24 }}>
      <h1>Grade Horária</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="viewType">Visualização:</label>
          <select
            id="viewType"
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'class' | 'professor' | 'room')}
            style={{ marginLeft: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="class">Por Turma</option>
            <option value="professor">Por Professor</option>
            <option value="room">Por Sala</option>
          </select>
        </div>

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

      <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>Instruções:</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Células azuis indicam aulas agendadas</li>
          <li>Passe o mouse sobre as células para ver detalhes completos</li>
          <li>Use os filtros acima para alterar a visualização e período</li>
        </ul>
      </div>

      <ScheduleGrid viewType={viewType} semester={semester} year={year} />
    </main>
  )
}

export default Schedule