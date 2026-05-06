export const mockData = {
  courses: [
    { id: '1', name: 'Matemática', description: 'Curso de Matemática' },
    { id: '2', name: 'Física', description: 'Curso de Física' },
    { id: '3', name: 'Química', description: 'Curso de Química' },
  ],
  classes: [
    { id: '1', name: 'Turma A', course: '1', professor: 'Cleber Moreira', room: 'Sala 01', schedule: '08:00' },
    { id: '2', name: 'Turma B', course: '2', professor: 'Dra. Adriana', room: 'Sala 02', schedule: '09:00' },
  ],
  users: [
    { username: 'coordenador-geral', name: 'Coordenador Geral', email: 'coord@school.com', roles: ['coordenador-geral'], active: true, courses: [] },
    { username: 'coordenador', name: 'Coordenador', email: 'coord2@school.com', roles: ['coordenador'], active: true, courses: ['Matemática', 'Física'] },
    { username: 'professor', name: 'Professor Silva', email: 'prof@school.com', roles: ['professor'], active: true, courses: ['Português', 'História'] },
  ],
  professors: [
    { id: 1, username: 'Cleber Moreira', name: 'Cleber Moreira', active: true },
    { id: 2, username: 'Dra. Adriana', name: 'Dra. Adriana', active: true },
  ],
  aulas: [
    { id: '1', disciplina: '1', turma: '1', professor: 1, sala: 1, dia_semana: 'SEG', horario_inicio: '08:00', horario_fim: '09:50', periodo_letivo: '2024.1' },
    { id: '2', disciplina: '2', turma: '2', professor: 2, sala: 2, dia_semana: 'TER', horario_inicio: '10:00', horario_fim: '11:50', periodo_letivo: '2024.1' },
  ],
  turmas: [
    { id: 1, nome: 'Turma A' },
    { id: 2, nome: 'Turma B' },
  ],
  disciplinas: [
    { id: '1', name: 'Direito Civil', courseId: '1', professors: ['Cleber Moreira'] },
    { id: '2', name: 'Lógica Python', courseId: '2', professors: ['Dra. Adriana'] },
    { id: '3', name: 'Química Experimental', courseId: '3', professors: ['professor'] },
  ],
  subjects: [
    { id: '1', name: 'Direito Civil', courseId: '1', professors: ['Cleber Moreira'] },
    { id: '2', name: 'Lógica Python', courseId: '2', professors: ['Dra. Adriana'] },
    { id: '3', name: 'Química Experimental', courseId: '3', professors: ['professor'] },
  ],
  salas: [
    { id: '1', name: 'Sala 01', block: 'Bloco A', type: 'Sala de Aula', capacity: 30, resources: ['Projetor', 'Quadro Branco'] },
    { id: '2', name: 'Sala 02', block: 'Bloco A', type: 'Sala de Aula', capacity: 25, resources: ['Projetor'] },
    { id: '3', name: 'Lab Química', block: 'Bloco B', type: 'Laboratório', capacity: 20, resources: ['Equipamentos Químicos', 'Pias'] },
  ],
  gerenciar: [
    { username: 'coordenador-geral', papel: 'coordenador-geral', ativo: true },
    { username: 'coordenador', papel: 'coordenador', ativo: true },
    { username: 'professor', papel: 'professor', ativo: true },
  ],
};