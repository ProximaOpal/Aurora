'use client'

import { useEffect, useRef, useState } from 'react'
import { mapLayers, calculateRoute, getCurrentLocation } from '@/lib/locationService'

interface MapComponentProps {
  isSatellite?: boolean
  showRoute?: boolean
  startCoords?: [number, number]
  endCoords?: [number, number]
}

export default function MapComponent({ 
  isSatellite = true,
  showRoute = false,
  startCoords,
  endCoords
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const layers = useRef<any>({})
  const currentLayer = useRef<string>('satellite')
  const [isInitialized, setIsInitialized] = useState(false)
  const userLocation = useRef<[number, number] | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainer.current || map.current || isInitialized) return

      try {
        const L = (await import('leaflet')).default

        // Get user location
        const location = await getCurrentLocation()
        const startLat = location?.lat || 37.7749
        const startLng = location?.lng || -122.4194
        userLocation.current = [startLat, startLng]

        // Create map at user location
        map.current = L.map(mapContainer.current, {
          scrollWheelZoom: true,
          zoomControl: false,
        }).setView([startLat, startLng], 13)

        // Initialize all layers
        mapLayers.forEach((layer) => {
          layers.current[layer.id] = L.tileLayer(layer.url, {
            attribution: layer.attribution,
            maxZoom: layer.maxZoom,
            className: `${layer.id}-tiles`,
          })
        })

        // Add default satellite layer
        layers.current['satellite'].addTo(map.current)

        // Add user location marker
        L.marker([startLat, startLng], {
          icon: L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMzM5OWZmIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        })
          .addTo(map.current)
          .bindPopup('Your Location')

        // Draw route if provided
        if (showRoute && startCoords && endCoords) {
          const routeData = await calculateRoute(startCoords[0], startCoords[1], endCoords[0], endCoords[1])
          if (routeData) {
            // Draw polyline
            L.polyline(routeData.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]), {
              color: '#3b82f6',
              weight: 3,
              opacity: 0.8,
            }).addTo(map.current)

            // Add start and end markers
            L.marker(startCoords, {
              icon: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMxMGI5ODEiIHJ4PSI0Ii8+PHRleHQgeD0iNiIgeT0iMTgiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+QTwvdGV4dD48L3N2Zz4=',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              }),
            })
              .addTo(map.current)
              .bindPopup('From')

            L.marker(endCoords, {
              icon: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNlZjQ0NDQiIHJ4PSI0Ii8+PHRleHQgeD0iNiIgeT0iMTgiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+QjwvdGV4dD48L3N2Zz4=',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              }),
            })
              .addTo(map.current)
              .bindPopup('To')

            // Fit bounds
            if (routeData.bounds) {
              const bounds = L.latLngBounds(
                [routeData.bounds.minLat, routeData.bounds.minLng],
                [routeData.bounds.maxLat, routeData.bounds.maxLng]
              )
              map.current.fitBounds(bounds, { padding: [50, 50] })
            }
          }
        }

        // Add styles
        if (!document.querySelector('style[data-map-style]')) {
          const style = document.createElement('style')
          style.setAttribute('data-map-style', 'true')
          style.textContent = `
            .leaflet-container {
              background-color: #0f172a !important;
            }
            .street-tiles, .dark-tiles, .cycle-tiles, .hiking-tiles, .transport-tiles {
              filter: invert(0.9) hue-rotate(200deg) saturate(1.2);
            }
            .leaflet-control-zoom-in,
            .leaflet-control-zoom-out {
              background-color: rgba(15, 23, 42, 0.8) !important;
              border-color: rgba(180, 83, 9, 0.5) !important;
              color: #fcd34d !important;
            }
            .leaflet-control-zoom-in:hover,
            .leaflet-control-zoom-out:hover {
              background-color: rgba(15, 23, 42, 0.95) !important;
            }
          `
          document.head.appendChild(style)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('[v0] Map initialization error:', error)
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [isInitialized])

  const switchLayer = (layerId: string) => {
    if (!map.current || !layers.current[layerId]) return

    // Remove current layer
    if (currentLayer.current && layers.current[currentLayer.current]) {
      map.current.removeLayer(layers.current[currentLayer.current])
    }

    // Add new layer
    layers.current[layerId].addTo(map.current)
    currentLayer.current = layerId
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full bg-slate-950" style={{ zIndex: 1 }} />
      
      {/* Layer Switcher - Right sidebar */}
      <div className="absolute right-4 top-4 z-40 space-y-2 flex flex-col">
        {mapLayers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => switchLayer(layer.id)}
            className={`px-3 py-2 rounded-lg font-light text-xs transition-all duration-200 border ${
              currentLayer.current === layer.id
                ? 'bg-amber-600 text-slate-900 border-amber-600'
                : 'bg-slate-900/80 text-amber-400 border-amber-600/50 hover:border-amber-600'
            }`}
          >
            {layer.name}
          </button>
        ))}
      </div>
    </div>
  )
}
