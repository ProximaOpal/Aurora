'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import SearchRoute from '@/components/SearchRoute'
import { useState } from 'react'

const DynamicMapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
      <p className="text-amber-400 font-light">Loading map...</p>
    </div>
  ),
})

export default function Dashboard() {
  const router = useRouter()
  const [route, setRoute] = useState<any>(null)

  const handleRouteChange = (startCoords: [number, number], endCoords: [number, number], summary: any) => {
    setRoute({
      startCoords,
      endCoords,
      summary,
    })
  }

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
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/protected')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-slate-900 font-light rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-xl font-light text-amber-50 tracking-wide">Aurora Navigation</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Search Bar */}
        <SearchRoute onRouteChange={handleRouteChange} />

        {/* Map Container */}
        <div className="mt-6 rounded-lg overflow-hidden shadow-2xl border-2 border-amber-600/40 h-screen max-h-96">
          <DynamicMapComponent 
            showRoute={!!route}
            startCoords={route?.startCoords}
            endCoords={route?.endCoords}
          />
        </div>
      </main>
    </div>
  )
}
