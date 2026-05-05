import { mockData } from './mockData';

const mockApi = {
  get: <T>(url: string): Promise<{data: T}> => {
    return new Promise<{data: any}>((resolve) => {
      setTimeout(() => {
        if (url === '/courses') {
          resolve({ data: mockData.courses });
        } else if (url === '/classes') {
          resolve({ data: mockData.classes });
        } else if (url === '/cursos') {
          resolve({ data: mockData.courses });
        } else if (url === '/users') {
          resolve({ data: mockData.users });
        } else if (url === '/professors') {
          resolve({ data: mockData.professors });
        } else if (url === '/aulas') {
          resolve({ data: mockData.aulas });
        } else if (url === '/turmas') {
          resolve({ data: mockData.turmas });
        } else if (url === '/disciplinas') {
          resolve({ data: mockData.disciplinas });
        } else if (url === '/subjects') {
          resolve({ data: mockData.subjects });
        } else if (url === '/salas') {
          resolve({ data: mockData.salas });
        } else if (url === '/rooms') {
          resolve({ data: mockData.salas });
        } else if (url === '/gerenciar') {
          resolve({ data: mockData.gerenciar });
        } else if (url.startsWith('/courses/')) {
          const id = url.split('/')[2];
          const course = mockData.courses.find(c => c.id === id);
          resolve({ data: course });
        } else if (url.startsWith('/classes/')) {
          const id = url.split('/')[2];
          const cls = mockData.classes.find(c => c.id === id);
          resolve({ data: cls });
        } else if (url.startsWith('/rooms/')) {
          const id = url.split('/')[2];
          // Assuming salas is array of strings, but rooms need objects. Mock some room objects.
          const room = { id, name: `Sala ${id}`, block: 'Bloco A', type: 'Sala de Aula', capacity: 30, resources: ['Projetor'] };
          resolve({ data: room });
        } else if (url.startsWith('/professors/')) {
          const username = url.split('/')[2];
          const prof = mockData.professors.find(p => p.username === username);
          resolve({ data: prof });
        } else if (url.startsWith('/subjects/')) {
          const id = url.split('/')[2];
          // Mock subject object
          const subject = { id, name: `Disciplina ${id}`, courseId: '1', professors: ['professor'] };
          resolve({ data: subject });
        } else {
          resolve({ data: [] });
        }
      }, 100); // Simulate delay
    });
  },
  post: (url: string, data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/auth/token/') {
          // Mock login success
          resolve({ data: { access: 'mock_token', refresh: 'mock_refresh' } });
        } else if (url === '/courses') {
          const newCourse = { ...data, id: Date.now().toString() };
          mockData.courses.push(newCourse);
          resolve({ data: newCourse });
        } else if (url === '/classes') {
          const newClass = { ...data, id: Date.now().toString() };
          mockData.classes.push(newClass);
          resolve({ data: newClass });
        } else {
          resolve({ data: {} });
        }
      }, 100);
    });
  },
  put: (url: string, data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/courses/')) {
          const id = url.split('/')[2];
          const index = mockData.courses.findIndex(c => c.id === id);
          if (index !== -1) {
            mockData.courses[index] = { ...mockData.courses[index], ...data };
            resolve({ data: mockData.courses[index] });
          }
        } else if (url.startsWith('/classes/')) {
          const id = url.split('/')[2];
          const index = mockData.classes.findIndex(c => c.id === id);
          if (index !== -1) {
            mockData.classes[index] = { ...mockData.classes[index], ...data };
            resolve({ data: mockData.classes[index] });
          }
        }
        resolve({ data: {} });
      }, 100);
    });
  },
  defaults: {
    headers: {
      common: {} as Record<string, string>,
    },
  },
};

export default mockApi;