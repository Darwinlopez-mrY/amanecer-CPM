import { useState, useEffect } from 'react'
import api from '../services/api'
import { Header } from '../components/Header'
import { 
  Users, Home, Calendar, DollarSign, TrendingUp, 
  UserPlus, House, BookMarked, Shield, UserX,
  CheckCircle, XCircle, Eye, Trash2, Edit
} from 'lucide-react'

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, propertiesRes, bookingsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/properties'),
          api.get('/admin/bookings')
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data)
        setProperties(propertiesRes.data)
        setBookings(bookingsRes.data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const changeUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole })
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
      alert('Rol actualizado')
    } catch (error) {
      alert('Error al actualizar rol')
    }
  }

  const deleteUser = async (userId, userName) => {
    if (confirm(`¿Eliminar al usuario "${userName}"?`)) {
      try {
        await api.delete(`/admin/users/${userId}`)
        setUsers(users.filter(u => u._id !== userId))
        alert('Usuario eliminado')
      } catch (error) {
        alert('Error al eliminar usuario')
      }
    }
  }

  const togglePropertyStatus = async (propertyId, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    if (confirm(`¿${action} esta propiedad?`)) {
      try {
        const endpoint = currentStatus ? 'deactivate' : 'activate'
        await api.put(`/admin/properties/${propertyId}/${endpoint}`)
        setProperties(properties.map(p => 
          p._id === propertyId ? { ...p, isActive: !currentStatus } : p
        ))
        alert(`Propiedad ${action}da`)
      } catch (error) {
        alert('Error al cambiar estado')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administrador</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${
              activeTab === 'stats'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp size={18} />
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={18} />
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${
              activeTab === 'properties'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home size={18} />
            Propiedades
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={18} />
            Reservas
          </button>
        </div>

        {/* Estadísticas */}
        {activeTab === 'stats' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Usuarios</h3>
                  <Users size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>🏠 Anfitriones: {stats.users.hosts}</span>
                  <span>👤 Huéspedes: {stats.users.guests}</span>
                  <span>👑 Admins: {stats.users.admins}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Propiedades</h3>
                  <Home size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.properties.active}</p>
                <p className="text-xs text-gray-500 mt-2">Activas / Total: {stats.properties.active}/{stats.properties.total}</p>
              </div>
              
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Reservas</h3>
                  <Calendar size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.bookings.total}</p>
                <p className="text-xs text-gray-500 mt-2">Confirmadas: {stats.bookings.confirmed}</p>
              </div>
              
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 text-sm">Ingresos</h3>
                  <DollarSign size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900">${stats.revenue?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">COP totales</p>
              </div>
            </div>

            {/* Gráfico simple de reservas mensuales */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Reservas por mes</h3>
              <div className="flex items-end gap-4 h-48">
                {stats.monthlyBookings?.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${Math.min((item.count / 10) * 100, 100)}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    <span className="text-xs font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Usuarios */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => changeUserRole(user._id, e.target.value)}
                          className={`text-sm px-2 py-1 rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'host' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          } border-0`}
                        >
                          <option value="guest">Huésped</option>
                          <option value="host">Anfitrión</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteUser(user._id, user.name)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Propiedades */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propiedad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anfitrión</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{property.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{property.hostId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{property.city}</td>
                      <td className="px-6 py-4 text-sm font-semibold">${property.pricePerNight?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          property.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {property.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => togglePropertyStatus(property._id, property.isActive)}
                          className={`text-sm ${
                            property.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'
                          }`}
                        >
                          {property.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reservas */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propiedad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Huésped</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fechas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.propertyId?.title || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{booking.guestId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">${booking.totalPrice?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmada' :
                           booking.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}