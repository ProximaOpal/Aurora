/**
 * Location Service - Uses open APIs for location data
 * Leverages OpenStreetMap Nominatim for geocoding
 * and OpenWeather for location-based data
 */

export interface LocationData {
  address: string
  lat: number
  lng: number
  city: string
  country: string
}

/**
 * Reverse geocode coordinates to get address information
 * Uses Nominatim (OpenStreetMap) - free and open source
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationData | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('[v0] Reverse geocoding failed:', response.statusText)
      return null
    }

    const data = await response.json()
    const address = data.address || {}

    return {
      address: data.display_name || 'Unknown location',
      lat,
      lng,
      city: address.city || address.town || address.village || 'Unknown',
      country: address.country || 'Unknown',
    }
  } catch (error) {
    console.error('[v0] Reverse geocoding error:', error)
    return null
  }
}

/**
 * Forward geocode address to get coordinates
 * Uses Nominatim (OpenStreetMap)
 */
export async function forwardGeocode(address: string): Promise<LocationData | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('[v0] Forward geocoding failed:', response.statusText)
      return null
    }

    const results = await response.json()
    if (!results || results.length === 0) {
      console.error('[v0] No geocoding results found for:', address)
      return null
    }

    const result = results[0]
    return await reverseGeocode(parseFloat(result.lat), parseFloat(result.lon))
  } catch (error) {
    console.error('[v0] Forward geocoding error:', error)
    return null
  }
}

/**
 * Get nearby points of interest (restaurants, hotels, etc)
 * Uses Overpass API (OpenStreetMap data)
 */
export async function getNearbyPOIs(
  lat: number,
  lng: number,
  type: 'restaurant' | 'hotel' | 'cafe' | 'museum' = 'restaurant'
): Promise<any[]> {
  try {
    const query = getOverpassQuery(lat, lng, type)
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })

    if (!response.ok) {
      console.error('[v0] POI search failed:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.elements || []
  } catch (error) {
    console.error('[v0] POI search error:', error)
    return []
  }
}

/**
 * Generate Overpass Query Language for nearby POIs
 */
function getOverpassQuery(lat: number, lng: number, type: string): string {
  const radius = 1000 // 1km radius
  const tagQuery = {
    restaurant: 'amenity=restaurant',
    hotel: 'tourism=hotel',
    cafe: 'amenity=cafe',
    museum: 'tourism=museum',
  }

  const tag = tagQuery[type as keyof typeof tagQuery] || 'amenity=restaurant'

  return `[out:json];
    (
      node[${tag}](around:${radius},${lat},${lng});
      way[${tag}](around:${radius},${lat},${lng});
    );
    out center;`
}

/**
 * Get current location using browser Geolocation API
 */
export async function getCurrentLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('[v0] Geolocation not supported')
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const locationData = await reverseGeocode(latitude, longitude)
        resolve(locationData)
      },
      (error) => {
        console.error('[v0] Geolocation error:', error)
        resolve(null)
      }
    )
  })
}

/**
 * Calculate route using OSRM (Open Source Routing Machine)
 * Returns coordinates for the route and distance/duration
 */
export async function calculateRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<any> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`,
      {
        headers: { 'Accept': 'application/json' },
      }
    )

    if (!response.ok) {
      console.error('[v0] Route calculation failed:', response.statusText)
      return null
    }

    const data = await response.json()
    if (!data.routes || data.routes.length === 0) {
      console.error('[v0] No route found')
      return null
    }

    const route = data.routes[0]
    return {
      coordinates: route.geometry.coordinates,
      distance: (route.distance / 1000).toFixed(2), // km
      duration: Math.round(route.duration / 60), // minutes
      bounds: calculateBounds(route.geometry.coordinates),
    }
  } catch (error) {
    console.error('[v0] Route calculation error:', error)
    return null
  }
}

/**
 * Calculate bounds from coordinates
 */
function calculateBounds(coordinates: [number, number][]): any {
  const lats = coordinates.map(coord => coord[1])
  const lngs = coordinates.map(coord => coord[0])
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  }
}

/**
 * Get nearby amenities and safety information
 */
export async function getNearbyAmenities(
  lat: number,
  lng: number,
  radius: number = 1500
): Promise<{ restaurants: number; hospitals: number; police: number; cafes: number }> {
  try {
    const amenityTypes = ['amenity=restaurant', 'amenity=hospital', 'amenity=police', 'amenity=cafe']
    const counts: any = { restaurants: 0, hospitals: 0, police: 0, cafes: 0 }

    for (const query of amenityTypes) {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `[out:json];node[${query}](around:${radius},${lat},${lng});out count;`,
      })

      if (response.ok) {
        const data = await response.json()
        const type = query.split('=')[1]
        counts[type] = data.elements?.length || 0
      }
    }

    return counts
  } catch (error) {
    console.error('[v0] Amenities fetch error:', error)
    return { restaurants: 0, hospitals: 0, police: 0, cafes: 0 }
  }
}

/**
 * Map layer configurations for different views
 */
export const mapLayers = [
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18,
  },
  {
    id: 'street',
    name: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  {
    id: 'dark',
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
    maxZoom: 19,
  },
  {
    id: 'terrain',
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
    maxZoom: 17,
  },
  {
    id: 'cycle',
    name: 'Cycle',
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '&copy; CyclOSM',
    maxZoom: 20,
  },
  {
    id: 'hiking',
    name: 'Hiking',
    url: 'https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png',
    attribution: '&copy; Waymarked Trails',
    maxZoom: 18,
  },
  {
    id: 'transport',
    name: 'Transport',
    url: 'https://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png',
    attribution: '&copy; OpenCycleMap',
    maxZoom: 18,
  },
]
