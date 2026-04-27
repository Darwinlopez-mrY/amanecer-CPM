import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'

// Solucionar problema de iconos de Leaflet con React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Componente para centrar el mapa cuando cambien las propiedades
function MapController({ properties, selectedProperty }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedProperty && selectedProperty.location?.coordinates) {
      const [lng, lat] = selectedProperty.location.coordinates
      map.flyTo([lat, lng], 15, { duration: 1.5 })
    } else if (properties.length > 0) {
      const firstProp = properties.find(p => p.location?.coordinates)
      if (firstProp) {
        const [lng, lat] = firstProp.location.coordinates
        map.setView([lat, lng], 10)
      } else {
        map.setView([4.7110, -74.0721], 6)
      }
    }
  }, [map, properties, selectedProperty])
  
  return null
}

export default function PropertyMap({ properties, onPropertySelect, selectedPropertyId }) {
  const [selectedId, setSelectedId] = useState(selectedPropertyId)
  
  const centerPosition = [4.7110, -74.0721]
  
  const validProperties = properties.filter(p => 
    p.location?.coordinates && 
    p.location.coordinates.length === 2 &&
    p.location.coordinates[0] !== 0 &&
    p.location.coordinates[1] !== 0
  )
  
  const handleMarkerClick = (property) => {
    setSelectedId(property._id)
    if (onPropertySelect) {
      onPropertySelect(property)
    }
  }
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border">
      <MapContainer
        center={centerPosition}
        zoom={6}
        style={{ height: '500px', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          properties={validProperties} 
          selectedProperty={validProperties.find(p => p._id === selectedId)}
        />
        
        {validProperties.map((property) => {
          const [lng, lat] = property.location.coordinates
          const isSelected = property._id === selectedId
          
          return (
            <Marker
              key={property._id}
              position={[lat, lng]}
              eventHandlers={{
                click: () => handleMarkerClick(property),
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-gray-900 text-sm">{property.title}</h3>
                  <p className="text-gray-500 text-xs">{property.city}</p>
                  <p className="text-primary font-semibold text-sm mt-1">
                    ${property.pricePerNight?.toLocaleString()} COP / noche
                  </p>
                  <Link
                    to={`/property/${property._id}`}
                    className="block mt-2 text-center bg-primary text-white text-xs py-1 rounded hover:bg-primary/90"
                  >
                    Ver detalles
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}