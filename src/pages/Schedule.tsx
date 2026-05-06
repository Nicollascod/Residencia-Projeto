import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ScheduleGrid from '../components/ScheduleGrid'
import type { ScheduledClass } from '../components/ScheduleGrid'
import mockApi from '../services/mockApi'

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

type DragPayload =
  | { type: 'unallocated-subject'; subjectId: number }
  | { type: 'scheduled-class'; scheduledClassId: string }


const normalizeTime = (time: string) => {
  if (time.length === 8 && time.includes(':')) {
    return time.slice(0, 5)
  }
  return time
}

const Schedule = () => {
  const [viewType, setViewType] = useState<'class' | 'professor' | 'room'>('class')
  const [semester, setSemester] = useState('2024.1')
  const [year, setYear] = useState(2024)
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([])
  const [draftScheduledClasses, setDraftScheduledClasses] = useState<ScheduledClass[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [hasPendingChanges, setHasPendingChanges] = useState(false)
  const [dragOverCellKey, setDragOverCellKey] = useState<string | null>(null)
  const [dragOverTrash, setDragOverTrash] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{
    itemId: number
    itemName: string
    day: string
    timeSlot: string
  } | null>(null)
  const scheduleStorageKey = `scheduledClasses-${semester}`
  const [allocationForm, setAllocationForm] = useState({
    classId: 0,
    subjectId: 0 as number | string,
    professorId: 0 as number | string,
    roomId: 0 as number | string
  })
  const [allocationError, setAllocationError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const scheduledResponse = await mockApi.get<ScheduledClass[]>('/aulas')
        const classesResponse = await mockApi.get<Class[]>('/turmas')
        const subjectsResponse = await mockApi.get<Subject[]>('/disciplinas')
        const roomsResponse = await mockApi.get<Room[]>('/salas')
        const professorsResponse = await mockApi.get<Professor[]>('/professors')

        const storedSchedule = localStorage.getItem(scheduleStorageKey)
        const initialScheduledClasses: ScheduledClass[] = storedSchedule
          ? JSON.parse(storedSchedule)
          : scheduledResponse.data

        setScheduledClasses(initialScheduledClasses)
        setDraftScheduledClasses(initialScheduledClasses)
        setClasses(classesResponse.data)
        setSubjects(subjectsResponse.data)
        setRooms(roomsResponse.data)
        setProfessors(professorsResponse.data)
      } catch (error) {
        console.error('Error fetching schedule data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [semester, year, scheduleStorageKey])

  const isSameId = (a: number | string, b: number | string) => String(a) === String(b)

  const getSubjectName = (subject: Subject) => subject.nome || subject.name || 'Disciplina sem nome'
  const getRoomName = (room: Room) => room.nome || room.name || 'Sala sem nome'

  const currentScheduledClasses = editMode ? draftScheduledClasses : scheduledClasses

  const getScheduledClassForCell = (itemId: number, day: string, slot: string) => {
    const [startTime] = slot.split('-')

    return currentScheduledClasses.find(sc => {
      const itemMatch =
        viewType === 'class'
          ? isSameId(sc.turma, itemId)
          : viewType === 'professor'
            ? isSameId(sc.professor, itemId)
            : isSameId(sc.sala, itemId)

      return (
        itemMatch &&
        sc.dia_semana === day &&
        normalizeTime(sc.horario_inicio) === normalizeTime(startTime) &&
        sc.periodo_letivo === semester
      )
    })
  }

  const isCellOccupied = (itemId: number, day: string, slot: string) =>
    Boolean(getScheduledClassForCell(itemId, day, slot))

  const hasScheduleConflict = (candidate: {
    id?: string
    turma: number | string
    professor: number | string
    sala: number | string
    dia_semana: string
    horario_inicio: string
    periodo_letivo: string
  }) => {
    return currentScheduledClasses.some(sc => {
      if (candidate.id && sc.id === candidate.id) return false
      if (sc.periodo_letivo !== candidate.periodo_letivo) return false
      if (sc.dia_semana !== candidate.dia_semana) return false
      if (normalizeTime(sc.horario_inicio) !== normalizeTime(candidate.horario_inicio)) return false
      return isSameId(sc.turma, candidate.turma) || isSameId(sc.professor, candidate.professor) || isSameId(sc.sala, candidate.sala)
    })
  }

  const unallocatedSubjects = subjects.filter(subject =>
    !currentScheduledClasses.some(sc => sc.periodo_letivo === semester && String(sc.disciplina) === String(subject.id))
  )

  const openAllocateModal = (
    itemId: number,
    itemName: string,
    day: string,
    timeSlot: string,
    preselectedSubjectId?: number
  ) => {
    setAllocationError(null)
    setSelectedSlot({ itemId, itemName, day, timeSlot })
    setAllocationForm({
      classId: viewType === 'class' ? itemId : classes[0]?.id ?? 0,
      subjectId: preselectedSubjectId ?? subjects[0]?.id ?? 0,
      professorId: viewType === 'professor' ? itemId : professors[0]?.id ?? 0,
      roomId: viewType === 'room' ? itemId : rooms[0]?.id ?? 0
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedSlot(null)
  }

  const handleAllocateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedSlot) return
    if (!allocationForm.classId || !allocationForm.subjectId || !allocationForm.professorId || !allocationForm.roomId) {
      setAllocationError('Preencha todos os campos antes de alocar.')
      return
    }

    const startTime = normalizeTime(selectedSlot.timeSlot.split('-')[0])
    const endTime = normalizeTime(selectedSlot.timeSlot.split('-')[1])
    const newSchedule: ScheduledClass = {
      id: Date.now().toString(),
      disciplina: String(allocationForm.subjectId),
      turma: allocationForm.classId,
      professor: allocationForm.professorId,
      sala: allocationForm.roomId,
      dia_semana: selectedSlot.day,
      horario_inicio: startTime,
      horario_fim: endTime,
      periodo_letivo: semester
    }

    if (hasScheduleConflict(newSchedule)) {
      setAllocationError('Conflito de horário: turma, professor ou sala já estão ocupados neste horário.')
      return
    }

    setDraftScheduledClasses(prev => [...prev, newSchedule])
    setHasPendingChanges(true)
    closeModal()
  }

  const handleCellClick = (itemId: number, itemName: string, day: string, timeSlot: string) => {
    if (!editMode) return
    if (isCellOccupied(itemId, day, timeSlot)) return
    openAllocateModal(itemId, itemName, day, timeSlot)
  }

  const handleCellDrop = (event: React.DragEvent<HTMLTableCellElement>, itemId: number, day: string, timeSlot: string) => {
    event.preventDefault()
    setDragOverCellKey(null)

    if (!editMode) return
    if (isCellOccupied(itemId, day, timeSlot)) return

    try {
      const data = event.dataTransfer.getData('application/json')
      const payload = JSON.parse(data) as DragPayload
      if (payload.type === 'unallocated-subject') {
        openAllocateModal(itemId, '', day, timeSlot, payload.subjectId)
        return
      }
      if (payload.type === 'scheduled-class') {
        relocateScheduledClass(payload.scheduledClassId, itemId, day, timeSlot)
      }
    } catch (error) {
      console.error('Dropping data error:', error)
    }
  }

  const relocateScheduledClass = (scheduledClassId: string, itemId: number, day: string, timeSlot: string) => {
    const selected = currentScheduledClasses.find(sc => sc.id === scheduledClassId)
    if (!selected) return

    const updatedSchedule: ScheduledClass = {
      ...selected,
      dia_semana: day,
      horario_inicio: normalizeTime(timeSlot.split('-')[0]),
      horario_fim: normalizeTime(timeSlot.split('-')[1]),
      turma: viewType === 'class' ? itemId : selected.turma,
      professor: viewType === 'professor' ? itemId : selected.professor,
      sala: viewType === 'room' ? itemId : selected.sala
    }

    if (hasScheduleConflict({ ...updatedSchedule, id: scheduledClassId })) {
      setAllocationError('Não é possível realocar: conflito de turma, professor ou sala neste horário.')
      return
    }

    setDraftScheduledClasses(prev =>
      prev.map(sc =>
        sc.id === scheduledClassId ? updatedSchedule : sc
      )
    )
    setHasPendingChanges(true)
  }

  const handleScheduledClassDragStart = (event: React.DragEvent<HTMLDivElement>, scheduledClassId: string) => {
    if (!editMode) return
    event.dataTransfer.setData('application/json', JSON.stringify({ type: 'scheduled-class', scheduledClassId }))
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleUnallocatedDragStart = (event: React.DragEvent<HTMLDivElement>, subjectId: number) => {
    if (!editMode) return
    event.dataTransfer.setData('application/json', JSON.stringify({ type: 'unallocated-subject', subjectId }))
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleCellDragOver = (_event: React.DragEvent<HTMLTableCellElement>, cellKey: string) => {
    if (!editMode) return
    setDragOverCellKey(cellKey)
  }

  const handleCellDragLeave = (cellKey: string) => {
    if (!editMode) return
    setDragOverCellKey(current => (current === cellKey ? null : current))
  }

  const handleTrashDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!editMode) return
    event.preventDefault()
    setDragOverTrash(true)
  }

  const handleTrashDragLeave = () => {
    setDragOverTrash(false)
  }

  const handleTrashDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOverTrash(false)

    if (!editMode) return
    try {
      const data = event.dataTransfer.getData('application/json')
      const payload = JSON.parse(data) as DragPayload
      if (payload.type === 'scheduled-class') {
        setDraftScheduledClasses(prev => prev.filter(sc => sc.id !== payload.scheduledClassId))
        setHasPendingChanges(true)
      }
    } catch (error) {
      console.error('Trash drop error:', error)
    }
  }

  const startEdit = () => {
    setDraftScheduledClasses(scheduledClasses)
    setHasPendingChanges(false)
    setEditMode(true)
    setAllocationError(null)
  }

  const cancelEdit = () => {
    setDraftScheduledClasses(scheduledClasses)
    setHasPendingChanges(false)
    setEditMode(false)
    setAllocationError(null)
  }

  const saveEdit = () => {
    setScheduledClasses(draftScheduledClasses)
    localStorage.setItem(scheduleStorageKey, JSON.stringify(draftScheduledClasses))
    setHasPendingChanges(false)
    setEditMode(false)
    setAllocationError(null)
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 1400, margin: '48px auto', padding: 24 }}>
        <div style={{ textAlign: 'center', padding: 24 }}>Carregando grade horária...</div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 1400, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <h1>Grade Horária</h1>
        {!editMode ? (
          <button
            onClick={startEdit}
            style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Editar Grade
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={saveEdit}
              disabled={!hasPendingChanges}
              style={{ padding: '10px 14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: hasPendingChanges ? 'pointer' : 'not-allowed', opacity: hasPendingChanges ? 1 : 0.65 }}
            >
              Salvar Edição
            </button>
            <button
              onClick={cancelEdit}
              style={{ padding: '10px 14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Cancelar Edição
            </button>
          </div>
        )}
      </div>

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
            {['2023.1', '2023.2', '2024.1', '2024.2', '2025.1', '2025.2'].map(sem => (
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
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>Instruções:</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Células azuis indicam aulas agendadas</li>
          <li>Use o botão "Editar Grade" para habilitar edição</li>
          <li>Clique em um slot vazio para abrir o formulário de alocação</li>
          <li>Arraste disciplina não alocada para um slot ou arraste aulas existentes para realocar</li>
          <li>Arraste uma aula para a lixeira para removê-la</li>
        </ul>
      </div>
      {allocationError && (
        <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c2c7', color: '#842029', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {allocationError}
        </div>
      )}

      {editMode && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ScheduleGrid
            viewType={viewType}
            semester={semester}
            scheduledClasses={currentScheduledClasses}
            classes={classes}
            subjects={subjects}
            rooms={rooms}
            professors={professors}
            editMode={editMode}
            dragOverCellKey={dragOverCellKey}
            onEmptyCellClick={handleCellClick}
            onCellDrop={handleCellDrop}
            onCellDragOver={handleCellDragOver}
            onCellDragLeave={handleCellDragLeave}
            onScheduledClassDragStart={handleScheduledClassDragStart}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            <section style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, backgroundColor: '#fff' }}>
              <h2 style={{ marginTop: 0 }}>Disciplinas Não Alocadas</h2>
              {unallocatedSubjects.length === 0 ? (
                <p>Nenhuma disciplina disponível para alocação.</p>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {unallocatedSubjects.map(subject => (
                    <div
                      key={subject.id}
                      draggable={editMode}
                      onDragStart={(event) => handleUnallocatedDragStart(event, Number(subject.id))}
                      style={{
                        border: '1px solid #ffc107',
                        borderRadius: 8,
                        padding: 12,
                        backgroundColor: '#fffbea',
                        cursor: 'grab',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}
                    >
                      <strong>{getSubjectName(subject)}</strong>
                      <div style={{ marginTop: 6, fontSize: 12, color: '#555' }}>
                        Professores: {subject.professores?.length ? String(subject.professores.join(', ')) : 'Nenhum'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section
              onDragOver={handleTrashDragOver}
              onDragLeave={handleTrashDragLeave}
              onDrop={handleTrashDrop}
              style={{
                border: '2px dashed',
                borderColor: dragOverTrash ? '#dc3545' : '#ccc',
                borderRadius: 8,
                padding: 24,
                textAlign: 'center',
                backgroundColor: dragOverTrash ? '#fdecea' : '#fff'
              }}
            >
              <strong>Lixeira</strong>
              <p style={{ margin: '8px 0 0 0' }}>Arraste aqui para remover uma aula da grade.</p>
            </section>
          </div>
        </div>
      )}

      {!editMode && (
        <ScheduleGrid
          viewType={viewType}
          semester={semester}
          scheduledClasses={currentScheduledClasses}
          classes={classes}
          subjects={subjects}
          rooms={rooms}
          professors={professors}
          editMode={editMode}
          dragOverCellKey={dragOverCellKey}
          onEmptyCellClick={handleCellClick}
          onCellDrop={handleCellDrop}
          onCellDragOver={handleCellDragOver}
          onCellDragLeave={handleCellDragLeave}
          onScheduledClassDragStart={handleScheduledClassDragStart}
        />
      )}

      {modalOpen && selectedSlot && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 24, width: 'min(95%, 520px)', boxShadow: '0 18px 40px rgba(0,0,0,0.25)' }}>
            <h2 style={{ marginTop: 0 }}>Alocar Aula</h2>
            <p style={{ margin: '8px 0 20px 0' }}><strong>Dia:</strong> {selectedSlot.day} • <strong>Horário:</strong> {selectedSlot.timeSlot}</p>
            <form onSubmit={handleAllocateSubmit} style={{ display: 'grid', gap: 16 }}>
              {allocationError && (
                <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c2c7', color: '#842029', padding: 12, borderRadius: 8 }}>
                  {allocationError}
                </div>
              )}
              <label>
                Turma:
                <select
                  value={allocationForm.classId}
                  onChange={(e) => setAllocationForm(prev => ({ ...prev, classId: Number(e.target.value) }))}
                  style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.nome}</option>
                  ))}
                </select>
              </label>

              <label>
                Disciplina:
                <select
                  value={allocationForm.subjectId}
                  onChange={(e) => setAllocationForm(prev => ({ ...prev, subjectId: Number(e.target.value) }))}
                  style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{getSubjectName(subject)}</option>
                  ))}
                </select>
              </label>

              <label>
                Professor:
                <select
                  value={allocationForm.professorId}
                  onChange={(e) => setAllocationForm(prev => ({ ...prev, professorId: Number(e.target.value) }))}
                  style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  {professors.map(prof => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Sala:
                <select
                  value={allocationForm.roomId}
                  onChange={(e) => setAllocationForm(prev => ({ ...prev, roomId: Number(e.target.value) }))}
                  style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{getRoomName(room)}</option>
                  ))}
                </select>
              </label>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeModal} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  Alocar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Schedule
