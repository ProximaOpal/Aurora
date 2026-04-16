'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Plane, Shield, Utensils as UtensilsIcon, LocateFixed, BookMarked, AlertCircle, Utensils } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import MapComponent to avoid SSR issues
const DynamicMapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center border border-amber-600/30">
      <p className="text-amber-400 font-light">Loading satellite map...</p>
    </div>
  ),
})

export default function Dashboard() {
  const router = useRouter()

  const navigationFeatures = [
    {
      icon: MapPin,
      label: 'Smart Search',
      description: 'AI-powered location finder',
      action: () => console.log('[v0] Smart Search activated'),
    },
    {
      icon: Plane,
      label: '3D View',
      description: 'Immersive navigation',
      action: () => console.log('[v0] 3D View activated'),
    },
    {
      icon: Shield,
      label: 'Safety',
      description: 'Real-time alerts',
      action: () => console.log('[v0] Safety alerts activated'),
    },
    {
      icon: UtensilsIcon,
      label: 'Explore',
      description: 'Discover locations',
      action: () => console.log('[v0] Explore activated'),
    },
  ]

  const bottomControls = [
    {
      icon: LocateFixed,
      label: 'Location',
      action: () => console.log('[v0] Current location requested'),
    },
    {
      icon: BookMarked,
      label: 'Saved',
      action: () => console.log('[v0] Saved places opened'),
    },
    {
      icon: AlertCircle,
      label: 'Alerts',
      action: () => console.log('[v0] Safety alerts opened'),
    },
    {
      icon: Utensils,
      label: 'Dining',
      action: () => console.log('[v0] Nearby dining opened'),
    },
  ]

  return (
    <div 
      className="min-h-screen bg-slate-950"
      style={{
        backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Black%20Gold%20Gradient%20Line%20Mandala%20Background%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-sQF25jXzZo1uDR10B6AuuRlU50TOxd.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-slate-950/70 pointer-events-none" />

      {/* Header with Back Navigation */}
      <header className="relative z-50 border-b border-amber-600/30 sticky top-0 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/protected')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-slate-900 font-light rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-2xl font-light text-amber-50 tracking-wide">
            Aurora Navigation
          </h1>
          <div className="w-32" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation Features */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <h2 className="text-amber-50 font-light text-sm uppercase tracking-widest mb-4 px-2">Features</h2>
              {navigationFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <button
                    key={feature.label}
                    onClick={feature.action}
                    className="w-full group relative overflow-hidden rounded-lg p-3 transition-all duration-300 border border-amber-600/40 hover:border-amber-600/80 hover:shadow-lg"
                    style={{
                      backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rosegold%20Marble%20Border%20Black%20Background%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-ORHb3WqZ3FIwjFF3LU2VclGh9kiHLn.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/30 transition-colors duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-amber-300 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-light text-amber-50 truncate">{feature.label}</p>
                        <p className="text-xs text-amber-100/50 truncate">{feature.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Center - Map Container (Square) */}
          <div className="lg:col-span-10">
            <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden shadow-2xl border-2 border-amber-600/40 hover:border-amber-600/70 transition-colors duration-300">
              <DynamicMapComponent isSatellite={true} />
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {bottomControls.map((control) => {
            const Icon = control.icon
            return (
              <button
                key={control.label}
                onClick={control.action}
                className="group relative overflow-hidden rounded-lg p-6 transition-all duration-300 border border-amber-600/40 hover:border-amber-600/80 hover:shadow-lg hover:scale-105"
                style={{
                  backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Islamic%20Background%20Green%20Mandala%20Patern%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-XZXrtT4YGmZjUoAr8qzVkzxGL24T3E.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/40 transition-colors duration-300" />
                <div className="relative z-10 text-center">
                  <Icon className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                  <p className="text-xs text-amber-50 font-light uppercase tracking-wider">{control.label}</p>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
