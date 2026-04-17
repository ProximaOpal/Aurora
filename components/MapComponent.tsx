'use client'

import { useEffect, useRef, useCallback } from 'react'

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
  const leafletRef = useRef<any>(null)

  const applyMapStyling = () => {
    if (!document.querySelector('style[data-map-custom]')) {
      const style = document.createElement('style')
      style.setAttribute('data-map-custom', 'true')
      style.textContent = `
        .leaflet-container { background-color: #0f172a !important; border-radius: 0.5rem; }
        .route-polyline-deep { filter: drop-shadow(0 0 8px rgba(29,78,216,0.9)) drop-shadow(0 2px 6px rgba(29,78,216,0.7)); }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out, .leaflet-control-attribution {
          background-color: rgba(15,23,42,0.8) !important;
          border-color: rgba(180,83,9,0.5) !important;
          color: #fcd34d !important;
        }
        .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
          background-color: rgba(15,23,42,0.95) !important;
        }
        .leaflet-popup-content-wrapper {
          background-color: rgba(15,23,42,0.95) !important;
          border-color: rgba(180,83,9,0.5) !important;
          color: #fcd34d !important;
          border-radius: 0.5rem;
        }
        .leaflet-popup-tip { background-color: rgba(15,23,42,0.95) !important; }
        .leaflet-pane, .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow,
        .leaflet-tile-pane, .leaflet-overlay-pane, .leaflet-shadow-pane,
        .leaflet-marker-pane, .leaflet-tooltip-pane, .leaflet-popup-pane {
          z-index: auto !important;
        }
        .leaflet-top, .leaflet-bottom { z-index: 400 !important; }
      `
      document.head.appendChild(style)
    }
  }

  const addRoute = useCallback((route: RouteData, L: any) => {
    if (!map.current || !route.coordinates.length) return
    if (routePolyline.current) routePolyline.current.remove()

    const latLngs = route.coordinates.map((coord) => [coord[1], coord[0]])

    routePolyline.current = L.polyline(latLngs, {
      color: '#1d4ed8',
      weight: 6,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
      className: 'route-polyline-deep',
    }).addTo(map.current)
  }, [])

  const clearMarkers = useCallback(() => {
    markers.current.forEach((m) => m.remove())
    markers.current = []
    circles.current.forEach((c) => c.remove())
    circles.current = []
  }, [])

  const addLocationMarker = useCallback((location: LocationPoint, type: 'start' | 'end', L: any) => {
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

    const marker = L.marker([location.lat, location.lng], { icon, title: location.name })
      .addTo(map.current)
      .bindPopup(`<div style="color:#92400e;font-size:13px;"><strong>${label}</strong> ${location.name}</div>`)

    markers.current.push(marker)
  }, [])

  const addLocationCircle = useCallback((lat: number, lng: number, L: any) => {
    if (!map.current) return
    const circle = L.circle([lat, lng], {
      radius: 1000,
      color: '#1d4ed8',
      weight: 2,
      opacity: 0.6,
      fillColor: '#1d4ed8',
      fillOpacity: 0.1,
    }).addTo(map.current)
    circles.current.push(circle)
  }, [])

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== 'undefined' && mapContainer.current && !map.current) {
        try {
          const L = (await import('leaflet')).default
          leafletRef.current = L

          map.current = L.map(mapContainer.current, {
            scrollWheelZoom: true,
          }).setView([1.2921, 36.8219], 6)

          const layerConfigs = [
            { id: 'satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Tiles &copy; Esri', maxZoom: 18 },
            { id: 'street', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap', maxZoom: 19 },
            { id: 'dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CartoDB', maxZoom: 19 },
            { id: 'terrain', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenTopoMap', maxZoom: 17 },
            { id: 'cycle', url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', attribution: '&copy; CyclOSM', maxZoom: 20 },
            { id: 'hiking', url: 'https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', attribution: '&copy; Waymarked Trails', maxZoom: 18 },
            { id: 'transport', url: 'https://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', attribution: '&copy; OpenCycleMap', maxZoom: 18 },
          ]

          layerConfigs.forEach((config) => {
            layers.current[config.id] = L.tileLayer(config.url, {
              attribution: config.attribution,
              maxZoom: config.maxZoom,
            })
          })

          layers.current[currentLayer]?.addTo(map.current)

          map.current.on('click', (e: any) => {
            if (onLocationClick) {
              onLocationClick({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                name: `Location (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
              })
            }
          })

          applyMapStyling()
        } catch (error) {
          console.error('Map initialization error:', error)
        }
      }
    }
    initMap()
  }, [])

  // Update route when routeData changes
  useEffect(() => {
    if (!map.current || !leafletRef.current) return
    if (routeData && routeData.coordinates.length) {
      addRoute(routeData, leafletRef.current)
    } else if (routePolyline.current) {
      routePolyline.current.remove()
      routePolyline.current = null
    }
  }, [routeData, addRoute])

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !leafletRef.current) return
    clearMarkers()
    if (startLocation) {
      addLocationMarker(startLocation, 'start', leafletRef.current)
      addLocationCircle(startLocation.lat, startLocation.lng, leafletRef.current)
    }
    if (endLocation) {
      addLocationMarker(endLocation, 'end', leafletRef.current)
      addLocationCircle(endLocation.lat, endLocation.lng, leafletRef.current)
    }
    if (startLocation && endLocation && map.current) {
      const L = leafletRef.current
      const bounds = L.latLngBounds([
        [startLocation.lat, startLocation.lng],
        [endLocation.lat, endLocation.lng],
      ])
      map.current.fitBounds(bounds, { padding: [60, 60] })
    }
  }, [startLocation, endLocation, addLocationMarker, addLocationCircle, clearMarkers])

  // Update tile layer when currentLayer changes
  useEffect(() => {
    if (!map.current || !layers.current[currentLayer]) return
    Object.values(layers.current).forEach((layer: any) => {
      if (map.current.hasLayer(layer)) map.current.removeLayer(layer)
    })
    layers.current[currentLayer].addTo(map.current)
  }, [currentLayer])

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />
}