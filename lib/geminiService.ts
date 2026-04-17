'use client'

/**
 * Gemini API service for real travel summary data
 * Provides AI-powered analysis of routes, amenities, and safety
 */

interface TravelSummary {
  locations: {
    from: string
    to: string
  }
  distance: string
  duration: string
  amenities: {
    restaurants: number
    hospitals: number
    police: number
    cafes: number
  }
  security: {
    level: 'Safe' | 'Moderate' | 'Caution'
    description: string
  }
  highlights: string[]
  recommendations: string[]
}

export async function getTravelSummary(
  fromLocation: string,
  toLocation: string,
  distance: string,
  duration: string,
  amenities: any
): Promise<TravelSummary> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

    if (!apiKey) {
      console.error('[v0] Gemini API key not found')
      return getDefaultTravelSummary(fromLocation, toLocation, distance, duration, amenities)
    }

    const prompt = `You are a professional travel safety and logistics analyst. Provide a comprehensive travel analysis for the following route. Use ONLY the provided data - no assumptions or external data.

ROUTE DETAILS:
- Origin: ${fromLocation}
- Destination: ${toLocation}
- Distance: ${distance} kilometers
- Estimated Duration: ${duration} minutes
- Average Speed: ${(parseFloat(distance) / (parseInt(duration) / 60)).toFixed(1)} km/h

AVAILABLE INFRASTRUCTURE & AMENITIES:
- Restaurants: ${amenities.restaurants} establishments within 1.5km radius
- Hospitals/Medical Facilities: ${amenities.hospitals} facilities
- Police Stations/Security Posts: ${amenities.police} stations
- Cafes/Rest Stops: ${amenities.cafes} locations

ANALYSIS REQUIRED:
Based ONLY on the above data, provide:
1. Security level assessment (Safe/Moderate/Caution)
2. Specific security description using actual amenity counts
3. Route highlights based on actual infrastructure
4. Practical recommendations for this specific journey

Respond as VALID JSON ONLY (no markdown formatting):
{
  "security": {
    "level": "Safe|Moderate|Caution",
    "description": "Specific 2-3 sentence assessment mentioning the actual amenity counts provided"
  },
  "highlights": ["Highlight 1 based on actual data", "Highlight 2 based on actual data", "Highlight 3 based on actual data"],
  "recommendations": ["Recommendation 1 for this specific journey", "Recommendation 2", "Recommendation 3"]
}

CRITICAL: Use only the data provided. Reference actual numbers and locations mentioned above.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      console.error('[v0] Gemini API error:', response.statusText)
      return getDefaultTravelSummary(fromLocation, toLocation, distance, duration, amenities)
    }

    const data = await response.json()
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return {
      locations: {
        from: fromLocation,
        to: toLocation,
      },
      distance,
      duration,
      amenities,
      security: analysisData.security || { level: 'Safe', description: 'Route appears safe for travel.' },
      highlights: analysisData.highlights || ['Well-connected route', 'Good amenities available', 'Popular travel corridor'],
      recommendations: analysisData.recommendations || [
        'Travel during daylight hours',
        'Check weather forecast',
        'Use updated navigation app',
      ],
    }
  } catch (error) {
    console.error('[v0] Gemini service error:', error)
    return getDefaultTravelSummary(fromLocation, toLocation, distance, duration, amenities)
  }
}

function getDefaultTravelSummary(
  fromLocation: string,
  toLocation: string,
  distance: string,
  duration: string,
  amenities: any
): TravelSummary {
  return {
    locations: {
      from: fromLocation,
      to: toLocation,
    },
    distance,
    duration,
    amenities,
    security: {
      level: 'Safe',
      description: 'Route is generally safe for travel with good infrastructure and amenities available.',
    },
    highlights: [
      'Well-connected urban route',
      `${amenities.restaurants} restaurants nearby`,
      `${amenities.hospitals} medical facilities`,
      'Popular travel corridor',
    ],
    recommendations: [
      'Travel during daylight for best visibility',
      'Check weather before departure',
      'Use real-time navigation for best route',
      'Stay hydrated during long journeys',
    ],
  }
}
