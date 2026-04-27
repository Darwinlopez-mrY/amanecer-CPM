import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardHost from './pages/DashboardHost'
import CreateProperty from './pages/CreateProperty'
import EditProperty from './pages/EditProperty'
import AdminPanel from './pages/AdminPanel'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/host" element={
            <PrivateRoute roles={['host', 'admin']}>
              <DashboardHost />
            </PrivateRoute>
          } />
          <Route path="/properties/new" element={
            <PrivateRoute roles={['host', 'admin']}>
              <CreateProperty />
            </PrivateRoute>
          } />
          <Route path="/properties/edit/:id" element={
            <PrivateRoute roles={['host', 'admin']}>
              <EditProperty />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute roles={['admin']}>
              <AdminPanel />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App