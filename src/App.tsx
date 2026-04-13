import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import RecoverPassword from './pages/RecoverPassword'
import ManageUsers from './pages/ManageUsers'
import Unauthorized from './pages/Unauthorized'
import Courses from './pages/Courses'
import CourseForm from './pages/CourseForm'
import Classes from './pages/Classes'
import ClassForm from './pages/ClassForm'
import Subjects from './pages/Subjects'
import SubjectForm from './pages/SubjectForm'
import Professors from './pages/Professors'
import ProfessorForm from './pages/ProfessorForm'
import Rooms from './pages/Rooms'
import RoomForm from './pages/RoomForm'
import Schedule from './pages/Schedule'
import UnallocatedSubjects from './pages/UnallocatedSubjects'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/new" element={<CourseForm />} />
        <Route path="/courses/:id" element={<CourseForm />} />
        <Route path="/courses/:id/edit" element={<CourseForm />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes/new" element={<ClassForm />} />
        <Route path="/classes/:id" element={<ClassForm />} />
        <Route path="/classes/:id/edit" element={<ClassForm />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/new" element={<SubjectForm />} />
        <Route path="/subjects/:id" element={<SubjectForm />} />
        <Route path="/subjects/:id/edit" element={<SubjectForm />} />
        <Route path="/professors" element={<Professors />} />
        <Route path="/professors/new" element={<ProfessorForm />} />
        <Route path="/professors/:username" element={<ProfessorForm />} />
        <Route path="/professors/:username/edit" element={<ProfessorForm />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/new" element={<RoomForm />} />
        <Route path="/rooms/:id" element={<RoomForm />} />
        <Route path="/rooms/:id/edit" element={<RoomForm />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/unallocated-subjects" element={<UnallocatedSubjects />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["coordenador-geral"]} />}>
        <Route path="/manage-users" element={<ManageUsers />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App;

