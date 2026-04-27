import { useState, useEffect } from 'react'
import api from '../services/api'
import { Header } from '../components/Header'
import { PropertyCard } from '../components/PropertyCard'
import PropertyMap from '../components/PropertyMap'
import { Search, MapPin, Calendar, Users, Star, Home as HomeIcon, Waves, Wifi, TreePine, Castle, Map as MapIcon, List } from 'lucide-react'

export default function Home() {
  const [properties, setProperties] = useState([])
  const [allProperties, setAllProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list')
  const [selectedProperty, setSelectedProperty] = useState(null)
  
  // Estado de búsqueda
  const [searchCity, setSearchCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  
  // Fechas para el backend
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Construir URL con filtros
        let url = '/properties?'
        if (searchCity) url += `city=${searchCity}&`
        if (startDate) url += `startDate=${startDate}&`
        if (endDate) url += `endDate=${endDate}&`
        if (guests > 1) url += `guests=${guests}&`
        
        const { data } = await api.get(url)
        setProperties(data)
        setAllProperties(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [searchCity, startDate, endDate, guests])

  const handleSearch = () => {
    // Convertir fechas al formato ISO para el backend
    if (checkIn) setStartDate(new Date(checkIn).toISOString())
    if (checkOut) setEndDate(new Date(checkOut).toISOString())
    // Forzar recarga
    setLoading(true)
  }

  const handleClearFilters = () => {
    setSearchCity('')
    setCheckIn('')
    setCheckOut('')
    setGuests(1)
    setStartDate('')
    setEndDate('')
  }

  const categories = [
    { name: "Cabañas", icon: HomeIcon },
    { name: "Frente al mar", icon: Waves },
    { name: "Piscina", icon: HomeIcon },
    { name: "Vistas increíbles", icon: Star },
    { name: "Diseño moderno", icon: HomeIcon },
    { name: "Wifi alto", icon: Wifi },
    { name: "Naturaleza", icon: TreePine },
    { name: "Castillos", icon: Castle }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance">
                Descubre tu próximo destino
              </h1>
              <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto text-pretty">
                Encuentra alojamientos únicos y experiencias inolvidables en los
                mejores destinos de Colombia.
              </p>
            </div>

            {/* Search Bar Funcional */}
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl mx-auto border">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                <div className="p-4 border-b sm:border-b-0 sm:border-r">
                  <label className="text-xs font-semibold text-gray-500">UBICACIÓN</label>
                  <div className="flex items-center mt-1">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <input 
                      type="text" 
                      placeholder="¿Dónde vas?" 
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                    />
                  </div>
                </div>
                <div className="p-4 border-b sm:border-b-0 sm:border-r">
                  <label className="text-xs font-semibold text-gray-500">LLEGADA</label>
                  <div className="flex items-center mt-1">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                    />
                  </div>
                </div>
                <div className="p-4 border-b sm:border-b-0 sm:border-r">
                  <label className="text-xs font-semibold text-gray-500">SALIDA</label>
                  <div className="flex items-center mt-1">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label className="text-xs font-semibold text-gray-500">HUÉSPEDES</label>
                  <div className="flex items-center mt-1">
                    <Users size={16} className="text-gray-400 mr-2" />
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full outline-none text-sm bg-transparent"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>
                          {num} huésped{num !== 1 ? 'es' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="border-t p-3 bg-gray-50 flex justify-between rounded-b-2xl">
                <button 
                  onClick={handleClearFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm px-4"
                >
                  Limpiar filtros
                </button>
                <button 
                  onClick={handleSearch}
                  className="bg-gray-900 text-white px-8 py-2 rounded-full hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <Search size={18} />
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Resultados de búsqueda */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500">
            {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            {searchCity && ` en ${searchCity}`}
            {checkIn && checkOut && ` del ${new Date(checkIn).toLocaleDateString()} al ${new Date(checkOut).toLocaleDateString()}`}
          </p>
        </div>

        {/* Toggle de vista */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List size={18} />
              Lista
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                viewMode === 'map'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapIcon size={18} />
              Mapa
            </button>
          </div>
        </div>

        {/* Vista de Mapa */}
        {viewMode === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <PropertyMap 
              properties={properties}
              onPropertySelect={setSelectedProperty}
              selectedPropertyId={selectedProperty?._id}
            />
            {selectedProperty && (
              <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
                <div className="flex gap-4">
                  <img
                    src={selectedProperty.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'}
                    alt={selectedProperty.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{selectedProperty.title}</h3>
                    <p className="text-gray-500 text-sm">{selectedProperty.city}</p>
                    <p className="text-primary font-semibold">${selectedProperty.pricePerNight?.toLocaleString()} COP / noche</p>
                  </div>
                  <Link
                    to={`/property/${selectedProperty._id}`}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition self-center"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vista de Lista */}
        {viewMode === 'list' && (
          <>
            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex overflow-x-auto gap-8 pb-4">
                {categories.map((cat, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSearchCity(cat.name === "Cabañas" ? "Cabañas" : cat.name)}
                    className="flex flex-col items-center min-w-[70px] group"
                  >
                    <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                      <cat.icon size={20} className="text-gray-700" />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Properties Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Alojamientos destacados
              </h2>
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron propiedades con esos criterios</p>
                  <button 
                    onClick={handleClearFilters}
                    className="mt-4 text-primary hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {properties.slice(0, 8).map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              )}
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-16 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-4">¿Tienes una propiedad?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Publica tu propiedad y comienza a recibir huéspedes de todo el mundo
                </p>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-full hover:bg-gray-100 transition">
                  Comenzar ahora
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Amanecer-CPM. Todos los derechos reservados.</p>
          <p className="mt-2">Encuentra tu lugar ideal en Colombia</p>
        </div>
      </footer>
    </div>
  )
}