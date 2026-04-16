'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Navigation,
  Layers,
  Plus,
  Minus,
  Compass,
  Bookmark,
  LogOut,
  MessageSquare,
  Navigation2,
  Eye,
  Leaf,
} from 'lucide-react'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
})

export default function MapDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState('map')
  const [mapView, setMapView] = useState('map') // map, satellite, terrain, traffic
  const router = useRouter()
  const mapRef = useRef<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
      setIsLoading(false)
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const navigationFeatures = [
    {
      icon: MessageSquare,
      label: 'Ask Maps',
      description: 'AI-powered search',
    },
    {
      icon: Navigation2,
      label: '3D Navigation',
      description: 'Immersive view',
    },
    {
      icon: Eye,
      label: 'Live View',
      description: 'AR directions',
    },
    {
      icon: Leaf,
      label: 'Eco Route',
      description: 'Green routing',
    },
  ]

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-amber-100 font-light">Loading...</div>
      </main>
    )
  }

  return (
    <main className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="border-b border-amber-600/20 bg-slate-950/80 backdrop-blur px-4 md:px-8 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-light text-amber-50 tracking-wide">
            Aurora Map
          </h1>
          <p className="text-xs text-amber-100/50 font-light">
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-6 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/50 text-amber-400 font-light rounded-lg transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      {/* Main Map Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Navigation Features */}
        <aside className="w-24 md:w-32 border-r border-amber-600/20 bg-slate-950/40 backdrop-blur flex flex-col items-center py-6 gap-4 flex-shrink-0 overflow-y-auto">
          {/* Mandala Decoration Top */}
          <div className="w-20 h-20 md:w-24 md:h-24 mb-4 opacity-30 rounded-lg overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-g1PTPlsX8hZuoixvKFGA1mJw4u4LPe.jpg"
              alt="mandala"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Buttons */}
          {navigationFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <button
                key={index}
                className="group relative flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-lg bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/30 transition-all duration-300 hover:scale-110"
                title={feature.label}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-amber-400 mb-1" />
                <span className="text-xs text-amber-100/70 font-light text-center px-1 line-clamp-2">
                  {feature.label}
                </span>
                {/* Tooltip */}
                <div className="absolute left-full ml-2 hidden group-hover:block bg-slate-900/90 border border-amber-600/50 rounded px-2 py-1 text-xs text-amber-100 font-light whitespace-nowrap z-50">
                  {feature.description}
                </div>
              </button>
            )
          })}

          {/* Mandala Decoration Bottom */}
          <div className="w-20 h-20 md:w-24 md:h-24 mt-4 opacity-30 rounded-lg overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D8%A5%D8%B7%D8%A7%D8%B1-ZDZFxjFKW3I5pcxBjMVbsSqUmEjk2p.jpg"
              alt="mandala"
              className="w-full h-full object-cover"
            />
          </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Map */}
          <MapComponent />

          {/* Map Controls - Top Right */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 z-40">
            {/* Layers Button */}
            <button
              onClick={() => setMapView(mapView === 'map' ? 'satellite' : 'map')}
              className="flex items-center gap-2 w-12 h-12 rounded-lg bg-slate-900/70 hover:bg-slate-900/90 border border-amber-600/50 text-amber-400 transition-all duration-300 justify-center group"
              title="Toggle layers"
            >
              <Layers className="w-5 h-5" />
              <div className="absolute right-full mr-2 hidden group-hover:block bg-slate-900/90 border border-amber-600/50 rounded px-2 py-1 text-xs text-amber-100 font-light whitespace-nowrap">
                Layers
              </div>
            </button>

            {/* Recenter */}
            <button
              className="flex items-center gap-2 w-12 h-12 rounded-lg bg-slate-900/70 hover:bg-slate-900/90 border border-amber-600/50 text-amber-400 transition-all duration-300 justify-center group"
              title="Recenter map"
            >
              <Compass className="w-5 h-5" />
              <div className="absolute right-full mr-2 hidden group-hover:block bg-slate-900/90 border border-amber-600/50 rounded px-2 py-1 text-xs text-amber-100 font-light whitespace-nowrap">
                Recenter
              </div>
            </button>
          </div>

          {/* Zoom Controls - Bottom Right */}
          <div className="absolute bottom-6 right-6 flex gap-2 z-40">
            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900/70 hover:bg-slate-900/90 border border-amber-600/50 text-amber-400 transition-all duration-300 group">
              <Plus className="w-5 h-5" />
              <div className="absolute right-full mr-2 bottom-0 hidden group-hover:block bg-slate-900/90 border border-amber-600/50 rounded px-2 py-1 text-xs text-amber-100 font-light whitespace-nowrap">
                Zoom In
              </div>
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900/70 hover:bg-slate-900/90 border border-amber-600/50 text-amber-400 transition-all duration-300 group">
              <Minus className="w-5 h-5" />
              <div className="absolute right-full mr-2 bottom-0 hidden group-hover:block bg-slate-900/90 border border-amber-600/50 rounded px-2 py-1 text-xs text-amber-100 font-light whitespace-nowrap">
                Zoom Out
              </div>
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-6 left-40 md:left-48 flex gap-3 z-40">
            {/* Current Location */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/70 hover:bg-slate-900/90 border border-amber-600/50 text-amber-400 font-light text-sm transition-all duration-300">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              My Location
            </button>

            {/* Saved Places */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/70 hover:bg-slate-900/90 border border-amber-600/50 text-amber-400 font-light text-sm transition-all duration-300">
              <Bookmark className="w-4 h-4" />
              Saved
            </button>

            {/* Eco Route Toggle */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/70 hover:bg-slate-900/90 border border-amber-600/50 text-amber-400 font-light text-sm transition-all duration-300">
              <Leaf className="w-4 h-4" />
              Eco Route
            </button>
          </div>
        </div>
      </div>

      {/* Mandala Background Decorations */}
      <div className="fixed bottom-0 right-0 w-48 h-48 opacity-5 pointer-events-none">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-g1PTPlsX8hZuoixvKFGA1mJw4u4LPe.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="fixed top-0 left-0 w-40 h-40 opacity-5 pointer-events-none">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Black%20Gold%20Gradient%20Line%20Mandala%20Background%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-hVpv1kjKSTpJLF2BcPdMEb4aMu2DAg.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>
    </main>
  )
}
