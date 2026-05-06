import React from 'react'

interface Class {
  id: number
  nome: string
}

interface Subject {
  id: number | string
  nome?: string
  name?: string
  professores?: (number | string)[]
}

interface Room {
  id: number | string
  nome?: string
  name?: string
}

interface Professor {
  id: number | string
  username: string
  name: string
  active?: boolean
}

export interface ScheduledClass {
  id: string
  disciplina: string
  turma: number | string
  professor: number | string
  sala: number | string
  dia_semana: string
  horario_inicio: string
  horario_fim: string
  periodo_letivo: string
}

interface ScheduleGridProps {
  viewType: 'class' | 'professor' | 'room'
  semester: string
  scheduledClasses: ScheduledClass[]
  classes: Class[]
  subjects: Subject[]
  rooms: Room[]
  professors: Professor[]
  editMode: boolean
  dragOverCellKey: string | null
  onEmptyCellClick: (itemId: number, itemName: string, day: string, timeSlot: string) => void
  onCellDrop: (event: React.DragEvent<HTMLTableCellElement>, itemId: number, day: string, timeSlot: string) => void
  onCellDragOver: (event: React.DragEvent<HTMLTableCellElement>, cellKey: string) => void
  onCellDragLeave: (cellKey: string) => void
  onScheduledClassDragStart: (event: React.DragEvent<HTMLDivElement>, scheduledClassId: string) => void
}

const daysOfWeek = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
const dayLabels = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const timeSlots = [
  '07:00-07:50', '08:00-08:50', '09:00-09:50', '10:00-10:50',
  '11:00-11:50', '12:00-12:50', '13:00-13:50', '14:00-14:50',
  '15:00-15:50', '16:00-16:50', '17:00-17:50', '18:00-18:50',
  '19:00-19:50', '20:00-20:50', '21:00-21:50', '22:00-22:50'
]

const normalizeTime = (time: string) => {
  if (time.length === 8 && time.includes(':')) {
    return time.slice(0, 5)
  }
  return time
}

const ScheduleGrid = ({
  viewType,
  semester,
  scheduledClasses,
  classes,
  subjects,
  rooms,
  professors,
  editMode,
  dragOverCellKey,
  onEmptyCellClick,
  onCellDrop,
  onCellDragOver,
  onCellDragLeave,
  onScheduledClassDragStart
}: ScheduleGridProps) => {
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

  const getItemId = (item: Class | Professor | Room) => Number(item.id)

  const isSameId = (a: number | string, b: number | string) => String(a) === String(b)

  const getItemName = (item: Class | Professor | Room) => {
    switch (viewType) {
      case 'class':
        return (item as Class).nome
      case 'professor':
        return (item as Professor).name
      case 'room':
        return (item as Room).nome || (item as Room).name || ''
      default:
        return ''
    }
  }

  const getScheduledClassForCell = (itemId: number, dayIndex: number, timeSlot: string) => {
    const [startTime] = timeSlot.split('-')

    return scheduledClasses.find(sc => {
      let matchesItem = false
      switch (viewType) {
        case 'class':
          matchesItem = isSameId(sc.turma, itemId)
          break
        case 'professor':
          matchesItem = isSameId(sc.professor, itemId)
          break
        case 'room':
          matchesItem = isSameId(sc.sala, itemId)
          break
      }

      return matchesItem &&
        sc.dia_semana === daysOfWeek[dayIndex] &&
        normalizeTime(sc.horario_inicio) === normalizeTime(startTime) &&
        sc.periodo_letivo === semester
    })
  }

  const getScheduledClassInfo = (scheduledClass: ScheduledClass) => {
    const subject = subjects.find(s => String(s.id) === String(scheduledClass.disciplina))
    const professor = professors.find(p => isSameId(p.id, scheduledClass.professor))
    const room = rooms.find(r => isSameId(r.id, scheduledClass.sala))
    const class_ = classes.find(c => isSameId(c.id, scheduledClass.turma))

    return {
      subjectName: subject?.nome || subject?.name || 'N/A',
      professorName: professor?.name || 'N/A',
      roomName: room?.nome || room?.name || 'N/A',
      className: class_?.nome || 'N/A'
    }
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
                  const cellKey = `${getItemId(item)}-${day}-${slot}`
                  const scheduledClass = getScheduledClassForCell(getItemId(item), dayIndex, slot)
                  const info = scheduledClass ? getScheduledClassInfo(scheduledClass) : null
                  const isEmpty = !scheduledClass
                  const isActiveDrag = dragOverCellKey === cellKey

                  return (
                    <td
                      key={cellKey}
                      onClick={() => {
                        if (editMode && isEmpty) {
                          onEmptyCellClick(getItemId(item), getItemName(item), daysOfWeek[dayIndex], slot)
                        }
                      }}
                      onDragOver={(event) => {
                        if (!editMode) return
                        event.preventDefault()
                        onCellDragOver(event, cellKey)
                      }}
                      onDragLeave={() => {
                        if (!editMode) return
                        onCellDragLeave(cellKey)
                      }}
                      onDrop={(event) => {
                        if (!editMode) return
                        onCellDrop(event, getItemId(item), daysOfWeek[dayIndex], slot)
                      }}
                      style={{
                        border: '1px solid #ddd',
                        padding: '4px',
                        backgroundColor: scheduledClass ? '#e3f2fd' : isActiveDrag ? '#d1ecf1' : '#fff',
                        cursor: editMode ? (isEmpty ? 'pointer' : 'grab') : scheduledClass ? 'pointer' : 'default',
                        minHeight: '60px',
                        verticalAlign: 'top',
                        transition: 'background-color 0.15s ease'
                      }}
                      title={info ? `${info.subjectName} - ${info.professorName} - ${info.roomName}` : ''}
                    >
                      {scheduledClass && (
                        <div
                          draggable={editMode}
                          onDragStart={(event) => onScheduledClassDragStart(event, scheduledClass.id)}
                          style={{
                            fontSize: '11px',
                            lineHeight: '1.2',
                            cursor: editMode ? 'grab' : 'default'
                          }}
                          title={editMode ? 'Arraste para realocar ou arraste para a lixeira' : ''}
                        >
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
