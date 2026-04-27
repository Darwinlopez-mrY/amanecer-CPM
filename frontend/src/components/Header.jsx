import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Globe, User, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">amanecer</span>
              <span className="text-2xl font-light">CPM</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary">Inicio</Link>
              <Link to="/habitaciones" className="text-sm font-medium hover:text-primary">Habitaciones</Link>
              <Link to="/destinos" className="text-sm font-medium hover:text-primary">Destinos</Link>
              <Link to="/experiencias" className="text-sm font-medium hover:text-primary">Experiencias</Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground">
              <Globe size={18} />
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">Hola, {user.name}</span>
                {(user.role === 'host' || user.role === 'admin') && (
                  <Link to="/dashboard/host" className="text-sm text-muted-foreground hover:text-foreground">
                    Mi Panel
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="text-sm text-red-600 hover:text-red-700">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium hover:text-primary">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm hover:bg-primary/90 transition">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-sm">Inicio</Link>
              <Link to="/habitaciones" className="text-sm">Habitaciones</Link>
              <Link to="/destinos" className="text-sm">Destinos</Link>
              <Link to="/experiencias" className="text-sm">Experiencias</Link>
              {user ? (
                <>
                  <span className="text-sm">Hola, {user.name}</span>
                  {(user.role === 'host' || user.role === 'admin') && (
                    <Link to="/dashboard/host" className="text-sm">Mi Panel</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-sm">Admin</Link>
                  )}
                  <button onClick={logout} className="text-sm text-left text-red-600">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm">Iniciar Sesión</Link>
                  <Link to="/register" className="text-sm">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}