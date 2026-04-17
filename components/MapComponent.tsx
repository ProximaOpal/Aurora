'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Hospital, Utensils, Coffee, AlertCircle } from 'lucide-react'

interface RouteData {
  coordinates: [number, number][]
  distance: string
  duration: string
}

interface LocationPoint {
  lat: number
  lng: number
  name: string
  type: 'start' | 'end'
}

interface ClickedLocation {
  lat: number
  lng: number
  name: string
  type?: string
}

interface MapComponentProps {
  isSatellite?: boolean
  currentLayer?: string
  onLayerChange?: (layerId: string) => void
  routeData?: RouteData | null
  startLocation?: LocationPoint
  endLocation?: LocationPoint
  onLocationClick?: (location: ClickedLocation) => void
}

export default function MapComponent({
  isSatellite = true,
  currentLayer = 'satellite',
  onLayerChange,
  routeData,
  startLocation,
  endLocation,
  onLocationClick,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const layers = useRef<any>({})
  const routePolyline = useRef<any>(null)
  const markers = useRef<any[]>([])
  const circles = useRef<any[]>([])
  const [mapIdle, setMapIdle] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== 'undefined' && mapContainer.current && !map.current) {
        try {
          const L = (await import('leaflet')).default

          // Create map
          map.current = L.map(mapContainer.current, {
            scrollWheelZoom: true,
          }).setView([37.7749, -122.4194], 12)

          // Initialize all layers
          const layerConfigs = [
            {
              id: 'satellite',
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              attribution: 'Tiles &copy; Esri',
              maxZoom: 18,
            },
            {
              id: 'street',
              url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              attribution: '&copy; OpenStreetMap',
              maxZoom: 19,
            },
            {
              id: 'dark',
              url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              attribution: '&copy; CartoDB',
              maxZoom: 19,
            },
            {
              id: 'terrain',
              url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
              attribution: '&copy; OpenTopoMap',
              maxZoom: 17,
            },
            {
              id: 'cycle',
              url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
              attribution: '&copy; CyclOSM',
              maxZoom: 20,
            },
            {
              id: 'hiking',
              url: 'https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png',
              attribution: '&copy; Waymarked Trails',
              maxZoom: 18,
            },
            {
              id: 'transport',
              url: 'https://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png',
              attribution: '&copy; OpenCycleMap',
              maxZoom: 18,
            },
          ]

          layerConfigs.forEach((config) => {
            layers.current[config.id] = L.tileLayer(config.url, {
              attribution: config.attribution,
              maxZoom: config.maxZoom,
            })
          })

          // Add initial layer
          layers.current[currentLayer].addTo(map.current)

          // Map idle event for auto zoom
          map.current.on('moveend', () => {
            console.log('[v0] Map idle - bounds updated')
            setMapIdle(true)
            setTimeout(() => setMapIdle(false), 1000)
          })

          // Add click handler for location info
          map.current.on('click', (e: any) => {
            handleMapClick(e.latlng.lat, e.latlng.lng, L)
          })

          // Apply map styling
          applyMapStyling()

          // Add route if available
          if (routeData) {
            addRoute(routeData, L)
          }

          // Add location markers and circles
          if (startLocation) {
            addLocationMarker(startLocation, 'start', L)
            addLocationCircle(startLocation.lat, startLocation.lng, L)
          }
          if (endLocation) {
            addLocationMarker(endLocation, 'end', L)
            addLocationCircle(endLocation.lat, endLocation.lng, L)
          }

          // Auto fit bounds if route exists
          if (routeData && startLocation && endLocation) {
            const bounds = L.latLngBounds([
              [startLocation.lat, startLocation.lng],
              [endLocation.lat, endLocation.lng],
            ])
            map.current.fitBounds(bounds, { padding: [100, 100] })
          }
        } catch (error) {
          console.error('[v0] Map initialization error:', error)
        }
      }
    }

    initMap()

    return () => {
      // Cleanup
      markers.current.forEach((m) => m.remove())
      circles.current.forEach((c) => c.remove())
      if (routePolyline.current) {
        routePolyline.current.remove()
      }
    }
  }, [])

  const addRoute = useCallback((route: RouteData, L: any) => {
    if (!map.current || !route.coordinates.length) return

    // Remove existing polyline
    if (routePolyline.current) {
      routePolyline.current.remove()
    }

    // Convert coordinates [lng, lat] to [lat, lng]
    const latLngs = route.coordinates.map((coord) => [coord[1], coord[0]])

    // Add polyline with deep blue color
    routePolyline.current = L.polyline(latLngs, {
      color: '#0369a1',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
      className: 'route-polyline-deep',
    }).addTo(map.current)

    console.log('[v0] Route polyline rendered')
  }, [])

  const addLocationMarker = useCallback(
    (location: LocationPoint, type: 'start' | 'end', L: any) => {
      if (!map.current) return

      const isStart = type === 'start'
      const markerColor = isStart ? '#22c55e' : '#ef4444'
      const label = isStart ? 'A' : 'B'

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="${markerColor}" opacity="0.2" stroke="${markerColor}" stroke-width="2"/>
        <circle cx="20" cy="20" r="10" fill="${markerColor}"/>
        <text x="20" y="26" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${label}</text>
      </svg>`

      const icon = L.icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      })

      const marker = L.marker([location.lat, location.lng], {
        icon,
        title: location.name,
      })
        .addTo(map.current)
        .bindPopup(`<div class="text-sm font-light text-amber-900"><strong>${label}</strong> ${location.name}</div>`)

      markers.current.push(marker)
    },
    []
  )

  const addLocationCircle = useCallback((lat: number, lng: number, L: any) => {
    if (!map.current) return

    const circle = L.circle([lat, lng], {
      radius: 1000,
      color: '#3b82f6',
      weight: 2,
      opacity: 0.3,
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      className: 'location-radius',
    }).addTo(map.current)

    circles.current.push(circle)
  }, [])

  const handleMapClick = useCallback(
    (lat: number, lng: number, L: any) => {
      // Add a temporary marker and card info
      if (onLocationClick) {
        onLocationClick({
          lat,
          lng,
          name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        })
      }

      console.log('[v0] Location clicked:', lat, lng)
    },
    [onLocationClick]
  )

  const applyMapStyling = () => {
    if (!document.querySelector('style[data-map-custom]')) {
      const style = document.createElement('style')
      style.setAttribute('data-map-custom', 'true')
      style.textContent = `
        .leaflet-container {
          background-color: #0f172a !important;
          border-radius: 0.5rem;
        }
        .route-polyline-deep {
          filter: drop-shadow(0 2px 4px rgba(15, 23, 42, 0.8)) drop-shadow(0 0 6px rgba(3, 105, 161, 0.6));
        }
        .location-radius {
          transition: all 0.3s ease;
        }
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          background-color: rgba(15, 23, 42, 0.8) !important;
          border-color: rgba(180, 83, 9, 0.5) !important;
          color: #fcd34d !important;
        }
        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background-color: rgba(15, 23, 42, 0.95) !important;
        }
        .leaflet-popup-content-wrapper {
          background-color: rgba(15, 23, 42, 0.95) !important;
          border-color: rgba(180, 83, 9, 0.5) !important;
          color: #fcd34d !important;
          border-radius: 0.5rem;
        }
        .leaflet-popup-tip {
          background-color: rgba(15, 23, 42, 0.95) !important;
          border-color: rgba(180, 83, 9, 0.5) !important;
        }
      `
      document.head.appendChild(style)
    }
  }

  useEffect(() => {
    if (routeData && map.current) {
      const L = window.L
      addRoute(routeData, L)
    }
  }, [routeData, addRoute])

  useEffect(() => {
    if (currentLayer && map.current && layers.current[currentLayer]) {
      // Remove all current layers
      Object.values(layers.current).forEach((layer: any) => {
        if (map.current.hasLayer(layer)) {
          map.current.removeLayer(layer)
        }
      })
      // Add selected layer
      layers.current[currentLayer].addTo(map.current)
      console.log('[v0] Layer changed to:', currentLayer)
    }
  }, [currentLayer])

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg border-2 border-amber-600/40" />
  )
}
