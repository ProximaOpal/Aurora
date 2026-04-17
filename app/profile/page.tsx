'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Route, Star, Trash2, Clock, Navigation2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SavedPlace {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  category: string
  created_at: string
}

interface RecentRoute {
  id: string
  from_name: string
  to_name: string
  distance_km: number
  duration_min: number
  security_level: string
  created_at: string
}

interface Profile {
  full_name: string
  username: string
  total_routes: number
  total_distance_km: number
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([])
  const [recentRoutes, setRecentRoutes] = useState<RecentRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      setUserEmail(user.email || '')

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) setProfile(profileData)

      const { data: places } = await supabase
        .from('saved_places')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(12)

      if (places) setSavedPlaces(places)

      const { data: routes } = await supabase
        .from('recent_routes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (routes) setRecentRoutes(routes)

      setLoading(false)
    }

    fetchData()
  }, [])

  const deletePlace = async (id: string) => {
    await supabase.from('saved_places').delete().eq('id', id)
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id))
  }

  const deleteRoute = async (id: string) => {
    await supabase.from('recent_routes').delete().eq('id', id)
    setRecentRoutes((prev) => prev.filter((r) => r.id !== id))
  }

  const getInitials = (name: string, email: string) => {
    if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    return email.slice(0, 2).toUpperCase()
  }

  const securityColor = (level: string) => {
    if (level === 'Safe') return 'text-green-400 border-green-500/30'
    if (level === 'Moderate') return 'text-yellow-400 border-yellow-500/30'
    return 'text-red-400 border-red-500/30'
  }

  const bgImage = 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Black%20Gold%20Gradient%20Line%20Mandala%20Background%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-sQF25jXzZo1uDR10B6AuuRlU50TOxd.jpg)'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-amber-400 font-light animate-pulse">Loading profile...</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-slate-950"
      style={{ backgroundImage: bgImage, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}
    >
      <div className="fixed inset-0 bg-slate-950/75 pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-amber-600/30">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-slate-900 font-light rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <h1 className="text-xl font-light text-amber-50 tracking-wide">My Profile</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Avatar + Stats */}
        <div className="bg-slate-900/60 border border-amber-600/30 rounded-xl p-6 backdrop-blur flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-20 h-20 rounded-full bg-amber-600/20 border-2 border-amber-600/60 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-light text-amber-300">
              {getInitials(profile?.full_name || '', userEmail)}
            </span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-light text-amber-50 mb-1">
              {profile?.full_name || profile?.username || 'Aurora User'}
            </h2>
            <p className="text-sm text-amber-100/60 font-light mb-4">{userEmail}</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/60 border border-amber-600/20 rounded-lg p-3 text-center">
                <p className="text-xl font-light text-amber-300">{profile?.total_routes ?? recentRoutes.length}</p>
                <p className="text-xs text-amber-100/60 font-light mt-1">Routes</p>
              </div>
              <div className="bg-slate-800/60 border border-amber-600/20 rounded-lg p-3 text-center">
                <p className="text-xl font-light text-amber-300">
                  {profile?.total_distance_km
                    ? Number(profile.total_distance_km).toFixed(0)
                    : recentRoutes.reduce((s, r) => s + (r.distance_km || 0), 0).toFixed(0)}
                </p>
                <p className="text-xs text-amber-100/60 font-light mt-1">km Traveled</p>
              </div>
              <div className="bg-slate-800/60 border border-amber-600/20 rounded-lg p-3 text-center">
                <p className="text-xl font-light text-amber-300">{savedPlaces.length}</p>
                <p className="text-xs text-amber-100/60 font-light mt-1">Saved Places</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Places */}
        <div>
          <h2 className="text-amber-50 font-light text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            Saved Places
          </h2>
          {savedPlaces.length === 0 ? (
            <div className="bg-slate-900/40 border border-amber-600/20 rounded-lg p-8 text-center">
              <MapPin className="w-8 h-8 text-amber-600/40 mx-auto mb-2" />
              <p className="text-amber-100/50 font-light text-sm">No saved places yet. Search routes to save locations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPlaces.map((place) => (
                <div key={place.id} className="bg-slate-900/60 border border-amber-600/30 rounded-lg p-4 backdrop-blur group relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-amber-50 font-light text-sm truncate">{place.name}</p>
                        <p className="text-amber-100/50 text-xs font-light mt-0.5 truncate">{place.address || `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-amber-600/10 border border-amber-600/20 rounded text-amber-400 font-light">{place.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePlace(place.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400/70 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Routes */}
        <div>
          <h2 className="text-amber-50 font-light text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <Route className="w-4 h-4 text-amber-400" />
            Recent Routes
          </h2>
          {recentRoutes.length === 0 ? (
            <div className="bg-slate-900/40 border border-amber-600/20 rounded-lg p-8 text-center">
              <Navigation2 className="w-8 h-8 text-amber-600/40 mx-auto mb-2" />
              <p className="text-amber-100/50 font-light text-sm">No routes yet. Use the dashboard to search routes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRoutes.map((route) => (
                <div key={route.id} className="bg-slate-900/60 border border-amber-600/30 rounded-lg p-4 backdrop-blur group flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-600/40 flex items-center justify-center">
                        <Navigation2 className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-amber-50 font-light text-sm truncate">
                        <span className="text-green-400">A</span> {route.from_name} → <span className="text-red-400">B</span> {route.to_name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-amber-100/50 font-light flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {route.distance_km?.toFixed(1)} km
                        </span>
                        <span className="text-xs text-amber-100/50 font-light flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {route.duration_min} min
                        </span>
                        {route.security_level && (
                          <span className={`text-xs font-light border rounded px-1.5 py-0.5 ${securityColor(route.security_level)}`}>
                            {route.security_level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRoute(route.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400/70 hover:text-red-400 flex-shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}