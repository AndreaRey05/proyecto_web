import { Routes, Route } from 'react-router-dom'
import AccesoGeneral from './pages/AccesoGeneral'
import Login from './pages/Login'
import LoginAlumno from './pages/LoginAlumno'
import LoginAdmin from './pages/LoginAdmin'
import Dashboard from './pages/Dashboard'


function App() {
  return (
    <Routes>
      <Route path="/"                element={<AccesoGeneral />} />
      <Route path="/login-profesor"  element={<Login />} />
      <Route path="/login-alumno"    element={<LoginAlumno />} />
      <Route path="/login-admin"     element={<LoginAdmin />} />
      <Route path="/dashboard"       element={<Dashboard />} />

    
    </Routes>
      
  )
}

export default App