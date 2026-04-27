import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { useState } from 'react'

export function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Link to={`/property/${property._id}`} className="group">
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
        />
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsLiked(!isLiked)
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition"
        >
          <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-foreground">{property.title}</h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm">4.9</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{property.city}</p>
        <p className="text-sm text-muted-foreground">A 2 km del centro</p>
        <p className="mt-1">
          <span className="font-semibold">${property.pricePerNight?.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground"> COP / noche</span>
        </p>
      </div>
    </Link>
  )
}