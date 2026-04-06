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

