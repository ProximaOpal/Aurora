'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Hotel, Plane, Shield, Utensils as UtensilsIcon, LocateFixed, BookMarked, AlertCircle, Utensils, Info } from 'lucide-react'
import dynamic from 'next/dynamic'
import SearchRoute from '@/components/SearchRoute'
import LayoutToggle from '@/components/LayoutToggle'
import { mapLayers } from '@/lib/locationService'

const DynamicMapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
      <p className="text-amber-400 font-light">Loading satellite map...</p>
    </div>
  ),
})

export default function Dashboard() {
  const router = useRouter()
  const [layout, setLayout] = useState<'compact' | 'expanded'>('compact')
  const [currentLayer, setCurrentLayer] = useState('satellite')
  const [routeData, setRouteData] = useState<any>(null)
  const [clickedLocation, setClickedLocation] = useState<any>(null)

  const navigationFeatures = [
    {
      icon: MapPin,
      label: 'Smart Search',
      description: 'AI-powered location finder',
    },
    {
      icon: Plane,
      label: '3D View',
      description: 'Immersive navigation',
    },
    {
      icon: Shield,
      label: 'Safety',
      description: 'Real-time alerts',
    },
    {
      icon: UtensilsIcon,
      label: 'Explore',
      description: 'Discover locations',
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
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-slate-950/70 pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-amber-600/30 sticky top-0 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push('/protected')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-slate-900 font-light rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="text-2xl font-light text-amber-50 tracking-wide">Aurora Navigation</h1>
            <LayoutToggle layout={layout} onLayoutChange={setLayout} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {layout === 'compact' ? (
          // Compact Layout - Sidebar + Map + Bottom
          <div>
            {/* Search Bar */}
            <div className="mb-6 bg-slate-900/40 border border-amber-600/30 rounded-lg p-4">
              <SearchRoute 
                onRouteFound={(data) => {
                  setRouteData({
                    coordinates: data.route.coordinates,
                    distance: data.route.distance,
                    duration: data.route.duration,
                  })
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-2">
                <div className="space-y-3">
                  <h2 className="text-amber-50 font-light text-sm uppercase tracking-widest mb-4 px-2">Features</h2>
                  {navigationFeatures.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <button
                        key={feature.label}
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

              {/* Center - Map & Right Sidebar */}
              <div className="lg:col-span-10 flex gap-6">
                {/* Map */}
                <div className="flex-1">
                  <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden shadow-2xl border-2 border-amber-600/40 hover:border-amber-600/70 transition-colors duration-300">
                    <DynamicMapComponent 
                      currentLayer={currentLayer}
                      routeData={routeData}
                      startLocation={routeData ? {
                        lat: 37.7749,
                        lng: -122.4194,
                        name: 'Start',
                      } : undefined}
                      endLocation={routeData ? {
                        lat: 34.0522,
                        lng: -118.2437,
                        name: 'End',
                      } : undefined}
                      onLocationClick={setClickedLocation}
                    />
                  </div>
                </div>

                {/* Right Sidebar - Layer Switcher */}
                <div className="hidden lg:block w-32">
                  <div className="space-y-2">
                    <h3 className="text-amber-50 font-light text-xs uppercase tracking-widest px-2">Layers</h3>
                    {mapLayers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => setCurrentLayer(layer.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-light transition-all duration-300 border ${
                          currentLayer === layer.id
                            ? 'bg-amber-600 text-slate-900 border-amber-600'
                            : 'bg-slate-900/40 text-amber-100 border-amber-600/40 hover:border-amber-600/70'
                        }`}
                        style={
                          currentLayer !== layer.id ? {
                            backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Islamic%20Background%20Green%20Mandala%20Patern%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-XZXrtT4YGmZjUoAr8qzVkzxGL24T3E.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          } : {}
                        }
                      >
                        <div className="absolute inset-0 bg-slate-950/50" />
                        <span className="relative z-10">{layer.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {bottomControls.map((control) => {
                const Icon = control.icon
                return (
                  <button
                    key={control.label}
                    onClick={control.action}
                    className="group relative overflow-hidden rounded-lg p-4 transition-all duration-300 border border-amber-600/40 hover:border-amber-600/80 hover:shadow-lg hover:scale-105"
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
          </div>
        ) : (
          // Expanded Layout - Full width with search on top
          <div className="space-y-6">
            {/* Search Bar - Full Width */}
            <div className="bg-slate-900/40 border border-amber-600/30 rounded-lg p-6">
              <SearchRoute 
                onRouteFound={(data) => {
                  setRouteData({
                    coordinates: data.route.coordinates,
                    distance: data.route.distance,
                    duration: data.route.duration,
                  })
                }}
              />
            </div>

            {/* Map - Full Width */}
            <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-amber-600/40 hover:border-amber-600/70 transition-colors duration-300 h-96">
              <DynamicMapComponent 
                currentLayer={currentLayer}
                routeData={routeData}
                onLocationClick={setClickedLocation}
              />
            </div>

            {/* Layer Switcher & Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Layer Switcher */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900/40 border border-amber-600/30 rounded-lg p-4 space-y-2">
                  <h3 className="text-amber-50 font-light text-sm uppercase tracking-widest">Map Layers</h3>
                  <div className="space-y-2">
                    {mapLayers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => setCurrentLayer(layer.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-light transition-all duration-300 border ${
                          currentLayer === layer.id
                            ? 'bg-amber-600 text-slate-900 border-amber-600'
                            : 'bg-slate-800/40 text-amber-100 border-amber-600/40 hover:border-amber-600/70'
                        }`}
                      >
                        {layer.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {navigationFeatures.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <button
                        key={feature.label}
                        className="group relative overflow-hidden rounded-lg p-4 transition-all duration-300 border border-amber-600/40 hover:border-amber-600/80 hover:shadow-lg"
                        style={{
                          backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rosegold%20Marble%20Border%20Black%20Background%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-ORHb3WqZ3FIwjFF3LU2VclGh9kiHLn.jpg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/30 transition-colors duration-300" />
                        <div className="relative z-10 text-center">
                          <Icon className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                          <p className="text-xs font-light text-amber-50">{feature.label}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bottomControls.map((control) => {
                const Icon = control.icon
                return (
                  <button
                    key={control.label}
                    onClick={control.action}
                    className="group relative overflow-hidden rounded-lg p-4 transition-all duration-300 border border-amber-600/40 hover:border-amber-600/80 hover:shadow-lg hover:scale-105"
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

            {/* Clicked Location Card */}
            {clickedLocation && (
              <div
                className="border border-amber-600/40 rounded-lg p-4"
                style={{
                  backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Islamic%20Background%20Green%20Mandala%20Patern%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-XZXrtT4YGmZjUoAr8qzVkzxGL24T3E.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-slate-950/70 rounded-lg" />
                <div className="relative z-10 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-amber-50 font-light mb-1">Location Info</h3>
                    <p className="text-sm text-amber-100/70 font-light">{clickedLocation.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
