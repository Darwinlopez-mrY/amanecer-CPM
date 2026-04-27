import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import DateRangePicker from '../components/DateRangePicker'
import { useAuth } from '../contexts/AuthContext'
import { 
  MapPin, Users, Bed, Bath, Wifi, Car, Coffee, Wind, 
  Star, Heart, Share2, Calendar, CheckCircle, Waves, 
  TreePine, Home as HomeIcon, Utensils, Tv
} from 'lucide-react'
import { Header } from '../components/Header'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unavailableDates, setUnavailableDates] = useState([])
  const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null })
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [reserving, setReserving] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const [propertyRes, datesRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get(`/properties/${id}/available-dates`)
        ])
        setProperty(propertyRes.data)
        setUnavailableDates(datesRes.data.unavailableDates || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  const handleDateSelect = (start, end) => {
    setSelectedDates({ startDate: start, endDate: end })
    if (start && end && property) {
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      setTotalPrice(nights * property.pricePerNight)
    } else {
      setTotalPrice(0)
    }
  }

  const handleReserve = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!selectedDates.startDate || !selectedDates.endDate) {
      alert('Por favor selecciona las fechas')
      return
    }

    setReserving(true)
    try {
      const response = await api.post('/bookings', {
        propertyId: property._id,
        checkIn: selectedDates.startDate,
        checkOut: selectedDates.endDate,
        totalPrice: totalPrice
      })
      
      if (response.data) {
        alert(`✅ ¡Reserva confirmada!\n\nFecha de entrada: ${selectedDates.startDate.toLocaleDateString()}\nFecha de salida: ${selectedDates.endDate.toLocaleDateString()}\nTotal: $${totalPrice.toLocaleString()} COP\n\nRecibirás un correo de confirmación.`)
        navigate('/')
      }
    } catch (error) {
      console.error('Error al reservar:', error)
      alert(error.response?.data?.message || 'Error al procesar la reserva')
    } finally {
      setReserving(false)
    }
  }

  const amenitiesMap = {
    wifi: { icon: Wifi, label: 'Wifi' },
    parking: { icon: Car, label: 'Parqueadero' },
    pool: { icon: Waves, label: 'Piscina' },
    ac: { icon: Wind, label: 'Aire acondicionado' },
    kitchen: { icon: Utensils, label: 'Cocina' },
    tv: { icon: Tv, label: 'TV' },
    breakfast: { icon: Coffee, label: 'Desayuno' },
    nature: { icon: TreePine, label: 'Naturaleza' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900">Propiedad no encontrada</h2>
          <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{property.city}, {property.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span>4.9</span>
            </div>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
          <div className="h-96 md:h-[500px]">
            <img
              src={property.images?.[selectedImage] || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {property.images?.slice(1, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx + 1)}
                className="h-48 overflow-hidden rounded-lg"
              >
                <img src={img} alt={`${property.title} ${idx + 2}`} className="w-full h-full object-cover hover:scale-105 transition" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información */}
          <div className="lg:col-span-2">
            {/* Anfitrión */}
            <div className="flex justify-between items-center pb-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Anfitrión: {property.hostId?.name || 'Usuario'}</h2>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <div className="flex items-center gap-1"><Users size={16} /> {property.maxGuests} huéspedes</div>
                  <div className="flex items-center gap-1"><Bed size={16} /> {property.bedrooms} habitaciones</div>
                  <div className="flex items-center gap-1"><Bath size={16} /> {property.bathrooms} baños</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsLiked(!isLiked)} className="p-2 rounded-full hover:bg-gray-100">
                  <Heart size={24} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Share2 size={24} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Descripción */}
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Servicios */}
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Servicios</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities?.map((amenity, idx) => {
                  const amenityKey = amenity.toLowerCase()
                  const amenityData = amenitiesMap[amenityKey] || { icon: CheckCircle, label: amenity }
                  const Icon = amenityData.icon
                  return (
                    <div key={idx} className="flex items-center gap-3 text-gray-600">
                      <Icon size={18} />
                      <span>{amenityData.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Columna derecha - Reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-xl p-6 shadow-lg bg-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold">${property.pricePerNight?.toLocaleString()}</span>
                  <span className="text-gray-500"> COP / noche</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.9</span>
                  <span className="text-gray-500">(10 reseñas)</span>
                </div>
              </div>

              <DateRangePicker 
                unavailableDates={unavailableDates}
                onSelect={handleDateSelect}
              />

              {totalPrice > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>${property.pricePerNight?.toLocaleString()} x {Math.ceil((selectedDates.endDate - selectedDates.startDate) / (1000 * 60 * 60 * 24))} noches</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="border-t my-3"></div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()} COP</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleReserve}
                disabled={reserving}
                className="w-full mt-4 bg-primary text-white py-3 rounded-full hover:bg-primary/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reserving ? 'Procesando...' : 'Reservar'}
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">No se te cobrará nada aún</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}