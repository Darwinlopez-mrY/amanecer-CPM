import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, User, Search, Globe } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-xl font-light tracking-tight">
            amanecer
            <span className="font-semibold">CPM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition">Inicio</Link>
            <Link to="/habitaciones" className="text-gray-600 hover:text-gray-900 transition">Habitaciones</Link>
            <Link to="/destinos" className="text-gray-600 hover:text-gray-900 transition">Destinos</Link>
            <Link to="/experiencias" className="text-gray-600 hover:text-gray-900 transition">Experiencias</Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900">
              <Globe size={20} />
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Hola, {user.name}</span>
                {user.role === 'host' && (
                  <Link to="/dashboard/host" className="text-gray-600 hover:text-gray-900 text-sm">Panel</Link>
                )}
                <button 
                  onClick={logout}
                  className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">Iniciar Sesión</Link>
                <Link 
                  to="/register" 
                  className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600">Inicio</Link>
              <Link to="/habitaciones" className="text-gray-600">Habitaciones</Link>
              <Link to="/destinos" className="text-gray-600">Destinos</Link>
              <Link to="/experiencias" className="text-gray-600">Experiencias</Link>
              {user ? (
                <>
                  <span className="text-gray-600">Hola, {user.name}</span>
                  <button onClick={logout} className="bg-black text-white px-5 py-2 rounded-full">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600">Iniciar Sesión</Link>
                  <Link to="/register" className="bg-black text-white px-5 py-2 rounded-full text-center">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}