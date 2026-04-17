'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, Navigation2 } from 'lucide-react'
import { forwardGeocode, calculateRoute, getNearbyAmenities, getCurrentLocation } from '@/lib/locationService'

interface SearchRouteProps {
  onRouteChange?: (startCoords: [number, number], endCoords: [number, number], summary: any) => void
}

export default function SearchRoute({ onRouteChange }: SearchRouteProps) {
  const [fromAddress, setFromAddress] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [routeSummary, setRouteSummary] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<any>(null)
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([])
  const [toSuggestions, setToSuggestions] = useState<any[]>([])

  useEffect(() => {
    const initLocation = async () => {
      const location = await getCurrentLocation()
      if (location) {
        setUserLocation(location)
        setFromAddress(location.city || 'Your Location')
      }
    }
    initLocation()
  }, [])

  const handleSearch = async () => {
    if (!fromAddress || !toAddress) return
    setIsLoading(true)

    try {
      // Geocode from and to addresses
      const fromLocation = await forwardGeocode(fromAddress)
      const toLocation = await forwardGeocode(toAddress)

      if (!fromLocation || !toLocation) {
        console.error('[v0] Geocoding failed')
        setIsLoading(false)
        return
      }

      const startCoords: [number, number] = [fromLocation.lat, fromLocation.lng]
      const endCoords: [number, number] = [toLocation.lat, toLocation.lng]

      // Calculate route
      const routeData = await calculateRoute(startCoords[0], startCoords[1], endCoords[0], endCoords[1])

      if (!routeData) {
        console.error('[v0] Route calculation failed')
        setIsLoading(false)
        return
      }

      // Get nearby amenities
      const amenities = await getNearbyAmenities(endCoords[0], endCoords[1])

      const summary = {
        from: fromLocation.city,
        to: toLocation.city,
        distance: routeData.distance,
        duration: routeData.duration,
        amenities,
        security: 'Good' // Placeholder
      }

      setRouteSummary(summary)
      if (onRouteChange) {
        onRouteChange(startCoords, endCoords, summary)
      }
    } catch (error) {
      console.error('[v0] Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div 
        className="relative overflow-hidden rounded-lg p-4 border border-amber-600/40 backdrop-blur"
        style={{
          backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rosegold%20Marble%20Border%20Black%20Background%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-ORHb3WqZ3FIwjFF3LU2VclGh9kiHLn.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            {/* From Input */}
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-amber-600/30">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="From your location"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="flex-1 bg-transparent text-amber-50 placeholder-amber-100/50 font-light outline-none text-sm"
                />
              </div>
            </div>

            {/* To Input */}
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-amber-600/30">
                <Navigation2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="To"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="flex-1 bg-transparent text-amber-50 placeholder-amber-100/50 font-light outline-none text-sm"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-slate-900 font-light rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Route Summary Card */}
      {routeSummary && (
        <div 
          className="relative overflow-hidden rounded-lg p-5 border border-amber-600/40"
          style={{
            backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Islamic%20Background%20Green%20Mandala%20Patern%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-XZXrtT4YGmZjUoAr8qzVkzxGL24T3E.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-amber-50 font-light text-lg">Travel Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">From</p>
                <p className="text-amber-50 font-light">{routeSummary.from}</p>
              </div>
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">To</p>
                <p className="text-amber-50 font-light">{routeSummary.to}</p>
              </div>
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">Distance</p>
                <p className="text-amber-50 font-light">{routeSummary.distance} km</p>
              </div>
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">Duration</p>
                <p className="text-amber-50 font-light">{routeSummary.duration} min</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-amber-600/30">
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">Restaurants</p>
                <p className="text-amber-50 font-light">{routeSummary.amenities.restaurants}</p>
              </div>
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">Hotels</p>
                <p className="text-amber-50 font-light">{routeSummary.amenities.hospitals || 0}</p>
              </div>
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">Cafes</p>
                <p className="text-amber-50 font-light">{routeSummary.amenities.cafes}</p>
              </div>
              <div>
                <p className="text-amber-100/70 text-xs font-light uppercase">Security</p>
                <p className="text-green-400 font-light">{routeSummary.security}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
