'use client'

import { useEffect, useRef } from 'react'

interface MapComponentProps {
  isSatellite?: boolean
}

export default function MapComponent({ isSatellite = true }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const satelliteLayer = useRef<any>(null)
  const streetLayer = useRef<any>(null)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window !== 'undefined' && mapContainer.current && !map.current) {
        try {
          const L = (await import('leaflet')).default

          // Create map centered on a default location (San Francisco)
          map.current = L.map(mapContainer.current, {
            scrollWheelZoom: true,
          }).setView([37.7749, -122.4194], 12)

          // Esri Satellite tiles (high-quality satellite imagery from open API)
          satelliteLayer.current = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
              attribution: 'Tiles &copy; Esri',
              maxZoom: 18,
              className: 'satellite-tiles',
            }
          )

          // OpenStreetMap street layer
          streetLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
            className: 'street-tiles',
          })

          // Add satellite as default layer
          satelliteLayer.current.addTo(map.current)

          // Add a marker for current location
          L.marker([37.7749, -122.4194], {
            icon: L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMzM5OWZmIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          })
            .addTo(map.current)
            .bindPopup('Your Location')

          // Custom styling for the map
          if (!document.querySelector('style[data-map-style]')) {
            const style = document.createElement('style')
            style.setAttribute('data-map-style', 'true')
            style.textContent = `
              .leaflet-container {
                background-color: #0f172a !important;
              }
              .street-tiles {
                filter: invert(0.9) hue-rotate(200deg) saturate(1.2);
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
              }
              .leaflet-popup-tip {
                background-color: rgba(15, 23, 42, 0.95) !important;
                border-color: rgba(180, 83, 9, 0.5) !important;
              }
            `
            document.head.appendChild(style)
          }
        } catch (error) {
          console.error('[v0] Failed to initialize map:', error)
        }
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full bg-slate-950"
      style={{ zIndex: 1 }}
    />
  )
}
