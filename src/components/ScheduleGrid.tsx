import { useState, useEffect } from 'react'
import api from '../services/api'

interface Class {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
  professors: string[]
}

interface Room {
  id: string
  name: string
}

interface User {
  username: string
  name: string
  roles: string[]
}

interface ScheduledClass {
  id: string
  classId: string
  subjectId: string
  professorUsername: string
  roomId: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:MM
  endTime: string // HH:MM
  semester: string
  year: number
}

interface ScheduleGridProps {
  viewType: 'class' | 'professor' | 'room'
  semester: string
  year: number
}

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
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
          api.get('/scheduled-classes', { params: { semester, year } }),
          api.get('/classes'),
          api.get('/subjects'),
          api.get('/rooms'),
          api.get('/users')
        ])

        setScheduledClasses(scheduledRes.data)
        setClasses(classesRes.data)
        setSubjects(subjectsRes.data)
        setRooms(roomsRes.data)
        setProfessors(professorsRes.data.filter((user: User) => user.roles?.includes('professor')))
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
        return (item as Class).name
      case 'professor':
        return (item as User).name
      case 'room':
        return (item as Room).name
      default:
        return ''
    }
  }

  const getItemId = (item: Class | User | Room) => {
    switch (viewType) {
      case 'class':
        return (item as Class).id
      case 'professor':
        return (item as User).username
      case 'room':
        return (item as Room).id
      default:
        return ''
    }
  }

  const getScheduledClassForCell = (itemId: string, dayIndex: number, timeSlot: string) => {
    const [startTime] = timeSlot.split('-')
    return scheduledClasses.find(sc => {
      let matchesItem = false
      switch (viewType) {
        case 'class':
          matchesItem = sc.classId === itemId
          break
        case 'professor':
          matchesItem = sc.professorUsername === itemId
          break
        case 'room':
          matchesItem = sc.roomId === itemId
          break
      }

      return matchesItem &&
             sc.dayOfWeek === dayIndex &&
             sc.startTime === startTime &&
             sc.semester === semester &&
             sc.year === year
    })
  }

  const getScheduledClassInfo = (scheduledClass: ScheduledClass) => {
    const subject = subjects.find(s => s.id === scheduledClass.subjectId)
    const professor = professors.find(p => p.username === scheduledClass.professorUsername)
    const room = rooms.find(r => r.id === scheduledClass.roomId)
    const class_ = classes.find(c => c.id === scheduledClass.classId)

    return {
      subjectName: subject?.name || 'N/A',
      professorName: professor?.name || 'N/A',
      roomName: room?.name || 'N/A',
      className: class_?.name || 'N/A'
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
            {daysOfWeek.map(day => (
              <th key={day} colSpan={timeSlots.length} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                {day}
              </th>
            ))}
          </tr>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}></th>
            {daysOfWeek.map(day =>
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
              {daysOfWeek.map((day, dayIndex) =>
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