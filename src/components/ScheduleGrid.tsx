import { useState, useEffect } from 'react'
import api from '../services/api'

interface Class {
  id: number
  nome: string
}

interface Subject {
  id: number
  nome: string
  professores: number[]
}

interface Room {
  id: number
  nome: string
}

interface User {
  id: number
  username: string
  first_name: string
  papel: string
}

interface ScheduledClass {
  id: string
  disciplina: string
  turma: string
  professor: number // ID
  sala: number // ID
  dia_semana: string // 'SEG', 'TER', etc.
  horario_inicio: string
  horario_fim: string
  periodo_letivo: string
}

interface ScheduleGridProps {
  viewType: 'class' | 'professor' | 'room'
  semester: string
  year: number
}

const daysOfWeek = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
const dayLabels = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const timeSlots = [
  '07:00-07:50', '08:00-08:50', '09:00-09:50', '10:00-10:50',
  '11:00-11:50', '12:00-12:50', '13:00-13:50', '14:00-14:50',
  '15:00-15:50', '16:00-16:50', '17:00-17:50', '18:00-18:50',
  '19:00-19:50', '20:00-20:50', '21:00-21:50', '22:00-22:50'
]

const ScheduleGrid = ({ viewType, semester, year }: ScheduleGridProps) => {
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [professors, setProfessors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [scheduledRes, classesRes, subjectsRes, roomsRes, professorsRes] = await Promise.all([
          api.get('/aulas'),
          api.get('/turmas'),
          api.get('/disciplinas'),
          api.get('/salas'),
          api.get('/gerenciar')
        ])

        setScheduledClasses(scheduledRes.data)
        setClasses(classesRes.data)
        setSubjects(subjectsRes.data)
        setRooms(roomsRes.data)
        setProfessors(professorsRes.data.filter((user: User) => user.papel === 'professor'))
      } catch (error) {
        console.error('Error fetching schedule data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [semester, year])

  const getYAxisItems = () => {
    switch (viewType) {
      case 'class':
        return classes
      case 'professor':
        return professors
      case 'room':
        return rooms
      default:
        return []
    }
  }

  const getItemName = (item: Class | User | Room) => {
    switch (viewType) {
      case 'class':
        return (item as Class).nome
      case 'professor':
        return (item as User).first_name
      case 'room':
        return (item as Room).nome
      default:
        return ''
    }
  }

  const getItemId = (item: Class | User | Room) => {
    return item.id
  }

  const getScheduledClassForCell = (itemId: number, dayIndex: number, timeSlot: string) => {
    const [startTime] = timeSlot.split('-')
    return scheduledClasses.find(sc => {
      let matchesItem = false
      switch (viewType) {
        case 'class':
          matchesItem = sc.turma === getYAxisItems().find(c => c.id === itemId)?.nome
          break
        case 'professor':
          matchesItem = sc.professor === itemId
          break
        case 'room':
          matchesItem = sc.sala === itemId
          break
      }

      return matchesItem &&
             sc.dia_semana === daysOfWeek[dayIndex] &&
             sc.horario_inicio === startTime + ':00' &&
             sc.periodo_letivo === semester
    })
  }

  const getScheduledClassInfo = (scheduledClass: ScheduledClass) => {
    const subject = subjects.find(s => s.nome === scheduledClass.disciplina)
    const professor = professors.find(p => p.id === scheduledClass.professor)
    const room = rooms.find(r => r.id === scheduledClass.sala)
    const class_ = classes.find(c => c.nome === scheduledClass.turma)

    return {
      subjectName: subject?.nome || 'N/A',
      professorName: professor?.first_name || 'N/A',
      roomName: room?.nome || 'N/A',
      className: class_?.nome || 'N/A'
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 24 }}>Carregando grade horária...</div>
  }

  const yAxisItems = getYAxisItems()

  return (
    <div style={{ overflowX: 'auto', marginTop: 24 }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1200px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5', minWidth: '200px' }}>
              {viewType === 'class' ? 'Turma' : viewType === 'professor' ? 'Professor' : 'Sala'}
            </th>
            {dayLabels.map(day => (
              <th key={day} colSpan={timeSlots.length} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                {day}
              </th>
            ))}
          </tr>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}></th>
            {dayLabels.map(day =>
              timeSlots.map(slot => (
                <th key={`${day}-${slot}`} style={{ border: '1px solid #ddd', padding: '4px', backgroundColor: '#f9f9f9', fontSize: '12px', textAlign: 'center', writingMode: 'vertical-rl', textOrientation: 'mixed', minWidth: '60px' }}>
                  {slot}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {yAxisItems.map(item => (
            <tr key={getItemId(item)}>
              <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                {getItemName(item)}
              </td>
              {dayLabels.map((day, dayIndex) =>
                timeSlots.map(slot => {
                  const scheduledClass = getScheduledClassForCell(getItemId(item), dayIndex, slot)
                  const info = scheduledClass ? getScheduledClassInfo(scheduledClass) : null

                  return (
                    <td
                      key={`${day}-${slot}`}
                      style={{
                        border: '1px solid #ddd',
                        padding: '4px',
                        backgroundColor: scheduledClass ? '#e3f2fd' : '#fff',
                        cursor: scheduledClass ? 'pointer' : 'default',
                        minHeight: '60px',
                        verticalAlign: 'top'
                      }}
                      title={info ? `${info.subjectName} - ${info.professorName} - ${info.roomName}` : ''}
                    >
                      {scheduledClass && (
                        <div style={{ fontSize: '11px', lineHeight: '1.2' }}>
                          <div style={{ fontWeight: 'bold', color: '#1976d2' }}>{info?.subjectName}</div>
                          {viewType !== 'professor' && <div>Prof: {info?.professorName}</div>}
                          {viewType !== 'room' && <div>Sala: {info?.roomName}</div>}
                          {viewType !== 'class' && <div>Turma: {info?.className}</div>}
                        </div>
                      )}
                    </td>
                  )
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScheduleGrid