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
