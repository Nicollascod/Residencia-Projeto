import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import mockApi from '../services/mockApi'

interface Room {
  id: string
  name: string
  block: string
  type: string
  capacity: number
  resources: string[]
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedBlock, setSelectedBlock] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await mockApi.get<Room[]>('/rooms')
        setRooms(response.data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    }
    fetchRooms()
  }, [])

  const filteredRooms = rooms.filter(room => {
    const blockMatch = !selectedBlock || room.block === selectedBlock
    const typeMatch = !selectedType || room.type === selectedType
    return blockMatch && typeMatch
  })

  const blocks = [...new Set(rooms.map(room => room.block))]
  const types = [...new Set(rooms.map(room => room.type))]

  const getCardStyle = (capacity: number) => {
    const baseStyle = { border: '1px solid #ccc', borderRadius: 8, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
    if (capacity < 20) {
      return { ...baseStyle, borderColor: '#dc3545', backgroundColor: '#f8d7da' }
    }
    return baseStyle
  }

  return (
    <main style={{ maxWidth: 1200, margin: '48px auto', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Salas</h1>
        {auth.user?.roles.includes('coordenador') && (
          <Link to="/rooms/new" style={{ padding: '10px 14px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
            Nova Sala
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div>
          <label htmlFor="blockFilter">Filtrar por Bloco:</label>
          <select
            id="blockFilter"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            style={{ marginLeft: 8, padding: 8 }}
          >
            <option value="">Todos os Blocos</option>
            {blocks.map(block => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="typeFilter">Filtrar por Tipo:</label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ marginLeft: 8, padding: 8 }}
          >
            <option value="">Todos os Tipos</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filteredRooms.map(room => (
          <div key={room.id} style={getCardStyle(room.capacity)}>
            <h3>{room.name}</h3>
            <p><strong>Bloco:</strong> {room.block}</p>
            <p><strong>Tipo:</strong> {room.type}</p>
            <p><strong>Capacidade:</strong> {room.capacity} alunos</p>
            <p><strong>Recursos:</strong> {room.resources.join(', ') || 'Nenhum'}</p>
            {room.capacity < 20 && (
              <p style={{ color: '#dc3545', fontWeight: 'bold', marginTop: 8 }}>
                ⚠️ Capacidade Crítica
              </p>
            )}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Link to={`/rooms/${room.id}`} style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
                Ver Detalhes
              </Link>
              {auth.user?.roles.includes('coordenador') && (
                <Link to={`/rooms/${room.id}/edit`} style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: 4 }}>
                  Editar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: 24 }}>Nenhuma sala encontrada.</p>
      )}
    </main>
  )
}

export default Rooms