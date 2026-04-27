cat > CreateProperty.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { uploadImages } from '../services/upload'
import { Header } from '../components/Header'
import { 
  X, Upload, MapPin, Home, Bed, Bath, Users, DollarSign, 
  Wifi, Car, Wind, Waves, Coffee, Tv, TreePine, Castle,
  Trash2, Award, Mountain, Eye, Zap
} from 'lucide-react'

// Lista de servicios - MISMA QUE LAS CATEGORÍAS
const amenitiesList = [
  { id: 'wifi', name: 'Wifi', icon: Wifi, category: 'Wifi alto' },
  { id: 'parking', name: 'Parqueadero', icon: Car, category: null },
  { id: 'ac', name: 'Aire acondicionado', icon: Wind, category: null },
  { id: 'pool', name: 'Piscina', icon: Waves, category: 'Piscina' },
  { id: 'kitchen', name: 'Cocina', icon: Coffee, category: null },
  { id: 'tv', name: 'TV', icon: Tv, category: null },
  { id: 'nature', name: 'Naturaleza', icon: TreePine, category: 'Naturaleza' },
  { id: 'castle', name: 'Castillo', icon: Castle, category: 'Castillos' },
  { id: 'cabin', name: 'Cabañas', icon: Home, category: 'Cabañas' },
  { id: 'beach', name: 'Frente al mar', icon: Waves, category: 'Frente al mar' },
  { id: 'mountain', name: 'Vistas increíbles', icon: Mountain, category: 'Vistas increíbles' },
  { id: 'modern', name: 'Diseño moderno', icon: Award, category: 'Diseño moderno' }
]

const cities = [
  'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Santa Marta', 
  'Barranquilla', 'Bucaramanga', 'Pereira', 'Manizales', 'San Andrés'
]

export default function CreateProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    pricePerNight: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    location: { type: 'Point', coordinates: [0, 0] }
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`La imagen ${file.name} es muy grande. Máximo 10MB.`)
        return false
      }
      return true
    })
    
    if (validFiles.length === 0) return
    
    setImages([...images, ...validFiles])
    
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreview(imagePreview.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrls = []
      if (images.length > 0) {
        imageUrls = await uploadImages(images)
      }

      const propertyData = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        maxGuests: Number(formData.maxGuests),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        images: imageUrls,
        location: {
          type: 'Point',
          coordinates: [-74.0721, 4.7110]
        }
      }

      await api.post('/properties', propertyData)
      alert('✅ Propiedad creada exitosamente')
      navigate('/dashboard/host')
    } catch (error) {
      console.error('Error:', error)
      alert(error.response?.data?.message || 'Error al crear la propiedad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Publicar nueva propiedad</h1>
          <p className="text-gray-500 mb-6">Completa la información de tu propiedad</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Hermoso apartamento en El Poblado"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe tu propiedad..."
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3"
                  required
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle, número, barrio"
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Huéspedes</label>
                <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleInputChange} min="1" className="w-full border rounded-lg p-3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} min="1" className="w-full border rounded-lg p-3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} min="1" className="w-full border rounded-lg p-3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio/noche</label>
                <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} min="1" placeholder="COP" className="w-full border rounded-lg p-3" required />
              </div>
            </div>

            {/* Servicios - Mismas que las categorías */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Servicios</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenitiesList.map((amenity) => {
                  const Icon = amenity.icon
                  const isSelected = formData.amenities.includes(amenity.id)
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition ${
                        isSelected 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm">{amenity.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Haz clic para subir imágenes</p>
                  <p className="text-xs text-gray-400">JPG, PNG, GIF hasta 10MB</p>
                </label>
              </div>
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {imagePreview.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img src={preview} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => navigate('/dashboard/host')} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
                {loading ? 'Publicando...' : 'Publicar propiedad'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}