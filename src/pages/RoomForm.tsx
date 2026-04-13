import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Room {
  id?: string
  name: string
  block: string
  type: string
  capacity: number
  resources: string[]
}

const availableResources = [
  'Projetor',
  'Quadro Branco',
  'Computadores',
  'Laboratório',
  'Ar Condicionado',
  'Wi-Fi',
  'Microfone',
  'Caixas de Som'
]

const roomTypes = [
  'Sala de Aula',
  'Laboratório',
  'Auditório',
  'Biblioteca',
  'Ginásio'
]

const RoomForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room>({
    name: '',
    block: '',
    type: '',
    capacity: 0,
    resources: []
  })
  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      const fetchRoom = async () => {
        try {
          const response = await api.get(`/rooms/${id}`)
          setRoom(response.data)
        } catch (error) {
          console.error('Error fetching room:', error)
        }
      }
      fetchRoom()
    }
  }, [id, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRoom({ ...room, [name]: name === 'capacity' ? parseInt(value) || 0 : value })
  }

  const handleResourceChange = (resource: string, checked: boolean) => {
    if (checked) {
      setRoom({ ...room, resources: [...room.resources, resource] })
    } else {
      setRoom({ ...room, resources: room.resources.filter(r => r !== resource) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await api.put(`/rooms/${id}`, room)
      } else {
        await api.post('/rooms', room)
      }
      navigate('/rooms')
    } catch (error) {
      console.error('Error saving room:', error)
    }
  }

  const isCapacityCritical = room.capacity > 0 && room.capacity < 20

  return (
    <main style={{ maxWidth: 600, margin: '48px auto', padding: 24 }}>
      <h1>{isEditing ? 'Editar Sala' : 'Nova Sala'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div>
          <label htmlFor="name">Nome da Sala:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={room.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div>
          <label htmlFor="block">Bloco:</label>
          <input
            type="text"
            id="block"
            name="block"
            value={room.block}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div>
          <label htmlFor="type">Tipo:</label>
          <select
            id="type"
            name="type"
            value={room.type}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">Selecione um tipo</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="capacity">Capacidade:</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={room.capacity}
            onChange={handleChange}
            required
            min="1"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {isCapacityCritical && (
            <p style={{ color: '#dc3545', fontWeight: 'bold', marginTop: 4 }}>
              ⚠️ Capacidade Crítica: Menos de 20 alunos
            </p>
          )}
        </div>

        <div>
          <label>Recursos Disponíveis:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginTop: 8 }}>
            {availableResources.map(resource => (
              <label key={resource} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={room.resources.includes(resource)}
                  onChange={(e) => handleResourceChange(resource, e.target.checked)}
                />
                {resource}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button type="submit" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
            Salvar
          </button>
          <button type="button" onClick={() => navigate('/rooms')} style={{ padding: '10px 14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}

export default RoomForm