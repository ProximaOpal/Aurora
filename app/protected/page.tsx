'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Hotel, Plane, Shield, Utensils, LogOut, Map, Navigation } from 'lucide-react'

export default function Protected() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-amber-100 font-light">Loading...</div>
      </main>
    )
  }

  const features = [
    {
      icon: MapPin,
      title: 'Smart Locations',
      description: 'Access geotagged insights for every destination',
    },
    {
      icon: Hotel,
      title: 'Premium Stays',
      description: 'Book exclusive accommodations',
    },
    {
      icon: Plane,
      title: 'Travel Plans',
      description: 'Seamless flight and transport booking',
    },
    {
      icon: Shield,
      title: 'Travel Safe',
      description: 'Real-time security alerts',
    },
    {
      icon: Utensils,
      title: 'Trending Eats',
      description: 'Sentiment-powered recommendations',
    },
    {
      icon: Navigation,
      title: 'Premium Access',
      description: 'Offline AI maps and features',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-amber-600/20 sticky top-0 z-50 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-amber-50 tracking-wide">
              Aurora
            </h1>
            <p className="text-xs text-amber-100/50 font-light">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-slate-900 font-light rounded-lg transition-all duration-300"
            >
              <Map className="w-4 h-4" />
              Open Map
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/50 text-amber-400 font-light rounded-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden h-80 md:h-96 relative group mb-20"
            style={{
              backgroundImage:
                'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%285%29-vfKxarfoaPCPV3H1Th3bXOvZXvVJmx.jpg)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/60 transition-colors duration-300" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-5xl md:text-6xl font-light text-amber-50 mb-4 tracking-wide">
                Welcome, {user?.email?.split('@')[0]}
              </h2>
              <p className="text-amber-100/70 font-light text-lg max-w-2xl">
                Your intelligent travel companion is ready. Explore destinations, book experiences, and travel smarter.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-4xl font-light text-amber-50 mb-12 tracking-wide">
              Your Tools
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const images = [
                  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-g1PTPlsX8hZuoixvKFGA1mJw4u4LPe.jpg',
                  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D8%A5%D8%B7%D8%A7%D8%B1-ZDZFxjFKW3I5pcxBjMVbsSqUmEjk2p.jpg',
                  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%285%29-vfKxarfoaPCPV3H1Th3bXOvZXvVJmx.jpg',
                ]
                const handleClick = () => {
                  if (index === 0) {
                    // Smart Locations - navigate to map
                    router.push('/dashboard')
                  }
                }
                return (
                  <div
                    key={index}
                    onClick={handleClick}
                    className="group relative overflow-hidden rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105 h-64"
                    style={{
                      backgroundImage: `url(${images[index % images.length]})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 transition-colors duration-300" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                      <Icon className="w-12 h-12 text-amber-400 mb-3 transition-transform duration-300 group-hover:scale-110" />
                      <h4 className="text-lg font-light text-amber-50 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-amber-100/70 font-light text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
