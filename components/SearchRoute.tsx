'use client'

import { useState, useEffect } from 'react'
import { Search, Loader, AlertCircle, CheckCircle, MapPin, Clock, Utensils, Hospital } from 'lucide-react'
import { calculateRoute, getNearbyAmenities, forwardGeocode } from '@/lib/locationService'
import { getTravelSummary } from '@/lib/geminiService'

interface TravelSummary {
  locations: { from: string; to: string }
  distance: string
  duration: string
  amenities: { restaurants: number; hospitals: number; police: number; cafes: number }
  security: { level: string; description: string }
  highlights: string[]
  recommendations: string[]
}

interface SearchRouteProps {
  onRouteFound?: (routeData: any) => void
  defaultFromLocation?: string
  userLocation?: { lat: number; lng: number }
}

export default function SearchRoute({ onRouteFound, defaultFromLocation, userLocation }: SearchRouteProps) {
  const [fromLocation, setFromLocation] = useState(defaultFromLocation || '')
  const [toLocation, setToLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [travelSummary, setTravelSummary] = useState<TravelSummary | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!fromLocation || !toLocation) {
      setError('Please enter both locations')
      return
    }

    setLoading(true)
    setError('')

    try {


      // Get coordinates for locations
      const fromCoords = await forwardGeocode(fromLocation)
      const toCoords = await forwardGeocode(toLocation)

      if (!fromCoords || !toCoords) {
        setError('Could not find one or both locations')
        setLoading(false)
        return
      }



      // Calculate route
      const route = await calculateRoute(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)

      if (!route) {
        setError('Could not calculate route')
        setLoading(false)
        return
      }



      // Get amenities for both locations
      const amenities = await getNearbyAmenities(toCoords.lat, toCoords.lng, 2000)

      // Get real travel summary from Gemini
      const summary = await getTravelSummary(
        fromLocation,
        toLocation,
        route.distance,
        route.duration,
        amenities
      )
      // Save route to Supabase
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('recent_routes').insert({
            user_id: user.id,
            from_name: fromLocation,
            to_name: toLocation,
            from_lat: fromCoords.lat,
            from_lng: fromCoords.lng,
            to_lat: toCoords.lat,
            to_lng: toCoords.lng,
            distance_km: parseFloat(route.distance),
            duration_min: route.duration,
            security_level: summary.security.level,
          })
          // Update total stats
          await supabase.rpc('increment_route_stats', {
            uid: user.id,
            dist: parseFloat(route.distance)
          })
        }
      } catch (e) {
        // Non-blocking — don't show error to user
      }
      setTravelSummary(summary)


      // Emit route data
      if (onRouteFound) {
        onRouteFound({
          route,
          startLocation: { lat: fromCoords.lat, lng: fromCoords.lng, name: fromLocation },
          endLocation: { lat: toCoords.lat, lng: toCoords.lng, name: toLocation },
        })
      }
    } catch (err) {
      console.error('[v0] Search error:', err)
      setError('Error searching route. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <label className="text-xs text-amber-100/70 font-light uppercase tracking-wider mb-1 block">
              From
            </label>
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="Your Location"
              className="w-full px-4 py-3 bg-slate-800/70 border border-amber-600/40 rounded-lg text-amber-50 placeholder-amber-100/50 focus:outline-none focus:border-amber-600/70 transition-colors"
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-2 w-4 h-4 text-amber-400 pointer-events-none" />
          </div>

          <div className="relative">
            <label className="text-xs text-amber-100/70 font-light uppercase tracking-wider mb-1 block">
              To
            </label>
            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="Destination"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 bg-slate-800/70 border border-amber-600/40 rounded-lg text-amber-50 placeholder-amber-100/50 focus:outline-none focus:border-amber-600/70 transition-colors"
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-2 w-4 h-4 text-amber-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-slate-900 font-light rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Search Route
            </>
          )}
        </button>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 font-light">{error}</p>
          </div>
        )}
      </div>

      {/* Travel Summary Card */}
      {travelSummary && (
        <div
          className="border border-amber-600/40 rounded-lg p-6 space-y-4"
          style={{
            backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Islamic%20Background%20Green%20Mandala%20Patern%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-XZXrtT4YGmZjUoAr8qzVkzxGL24T3E.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-slate-950/70 rounded-lg" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-light text-amber-50 mb-1">Travel Summary</h3>
                <p className="text-sm text-amber-100/70 font-light">
                  {travelSummary.locations.from} → {travelSummary.locations.to}
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900/50 border border-amber-600/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-100/70 font-light">Distance</span>
                </div>
                <p className="text-lg font-light text-amber-50">{travelSummary.distance} km</p>
              </div>

              <div className="bg-slate-900/50 border border-amber-600/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-100/70 font-light">Duration</span>
                </div>
                <p className="text-lg font-light text-amber-50">{travelSummary.duration} min</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-slate-900/50 border border-amber-600/30 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-light text-amber-50 mb-2">Nearby Amenities</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-amber-100/70 font-light">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  {travelSummary.amenities.restaurants} Restaurants
                </div>
                <div className="flex items-center gap-2 text-amber-100/70 font-light">
                  <Hospital className="w-4 h-4 text-amber-400" />
                  {travelSummary.amenities.hospitals} Hospitals
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className={`bg-slate-900/50 border rounded-lg p-3 mb-4 ${travelSummary.security.level === 'Safe'
                ? 'border-green-500/30'
                : travelSummary.security.level === 'Moderate'
                  ? 'border-yellow-500/30'
                  : 'border-red-500/30'
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full ${travelSummary.security.level === 'Safe'
                      ? 'bg-green-400'
                      : travelSummary.security.level === 'Moderate'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                />
                <h4 className="text-sm font-light text-amber-50">
                  Security: <span className="text-amber-400">{travelSummary.security.level}</span>
                </h4>
              </div>
              <p className="text-xs text-amber-100/70 font-light leading-relaxed">
                {travelSummary.security.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="mb-4">
              <h4 className="text-sm font-light text-amber-50 mb-2">Highlights</h4>
              <ul className="space-y-1">
                {travelSummary.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-100/70 font-light">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-light text-amber-50 mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {travelSummary.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-100/70 font-light">
                    <span className="text-amber-400 mt-1">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
