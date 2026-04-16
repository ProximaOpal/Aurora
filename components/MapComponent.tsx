import { useEffect, useRef } from 'react'

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    // Dynamic import of Leaflet
    const initMap = async () => {
      if (typeof window !== 'undefined' && mapContainer.current) {
        const L = require('leaflet')
        require('leaflet/dist/leaflet.css')

        if (!map.current) {
          // Create map centered on a default location (San Francisco)
          map.current = L.map(mapContainer.current).setView([37.7749, -122.4194], 12)

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
            className: 'map-tiles',
          }).addTo(map.current)

          // Add a marker for current location
          const marker = L.marker([37.7749, -122.4194], {
            icon: L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMzM5OWZmIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          })
            .addTo(map.current)
            .bindPopup('Your Location')

          // Add zoom and recenter controls
          map.current.zoomControl.setPosition('bottomright')

          // Custom styling for the map
          const style = document.createElement('style')
          style.textContent = `
            .leaflet-container {
              background-color: #0f172a !important;
            }
            .leaflet-tile {
              filter: invert(0.9) hue-rotate(200deg) saturate(1.2);
            }
            .map-tiles {
              filter: invert(0.9) hue-rotate(200deg) saturate(1.2);
            }
            .leaflet-control-zoom-in,
            .leaflet-control-zoom-out,
            .leaflet-control-attribution {
              background-color: rgba(15, 23, 42, 0.7) !important;
              border-color: rgba(180, 83, 9, 0.5) !important;
              color: #fcd34d !important;
            }
            .leaflet-control-zoom-in:hover,
            .leaflet-control-zoom-out:hover {
              background-color: rgba(15, 23, 42, 0.9) !important;
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
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.off()
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
