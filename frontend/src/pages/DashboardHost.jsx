import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Header } from '../components/Header'
import { Plus, Home, Calendar, DollarSign, Trash2, Edit, Eye } from 'lucide-react'

export default function DashboardHost() {
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('properties')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, bookingsRes] = await Promise.all([
          api.get('/properties?mine=true'),
          api.get('/bookings/host/bookings')
        ])
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

  const deleteProperty = async (id) => {
    if (confirm('¿Eliminar esta propiedad?')) {
      try {
        await api.delete(`/properties/${id}`)
        setProperties(properties.filter(p => p._id !== id))
        alert('Propiedad eliminada')
      } catch (error) {
        alert('Error al eliminar')
      }
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status })
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status } : b
      ))
    } catch (error) {
      alert('Error al actualizar')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Anfitrión</h1>
          <Link
            to="/properties/new"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            <Plus size={18} />
            Nueva propiedad
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${
              activeTab === 'properties'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home size={18} />
            Mis propiedades ({properties.length})
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
            Reservas recibidas ({bookings.length})
          </button>
        </div>

        {/* Propiedades */}
        {activeTab === 'properties' && (
          <div>
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <Home size={48} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No tienes propiedades</h3>
                <p className="text-gray-500 mb-4">Comienza publicando tu primera propiedad</p>
                <Link to="/properties/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                  Publicar propiedad
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property._id} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition">
                    <img
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{property.city}</p>
                      <p className="text-primary font-semibold">${property.pricePerNight.toLocaleString()} COP / noche</p>
                      <div className="flex gap-2 mt-4">
                        <Link
                          to={`/property/${property._id}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                        >
                          <Eye size={16} /> Ver
                        </Link>
                        <Link
                          to={`/properties/edit/${property._id}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                        >
                          <Edit size={16} /> Editar
                        </Link>
                        <button
                          onClick={() => deleteProperty(property._id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reservas */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No hay reservas</h3>
                <p className="text-gray-500">Aún no has recibido reservas en tus propiedades</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-lg border p-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{booking.propertyId?.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Huésped: {booking.guestId?.name}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span>📅 {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}</span>
                          <span>💰 ${booking.totalPrice.toLocaleString()} COP</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)} border-0 focus:ring-1`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmar</option>
                          <option value="cancelled">Cancelar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}