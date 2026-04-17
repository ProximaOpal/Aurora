'use client'

/**
 * Gemini API service for real travel summary data
 * Provides AI-powered analysis of routes, amenities, and safety
 */

interface TravelSummary {
  locations: {
    from: string
    to: string
    bestTravelTime?: string
    concerns?: string | null
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

    const avgSpeed = (parseFloat(distance) / (parseInt(String(duration)) / 60)).toFixed(1)
    bestTravelTime: analysisData.bestTravelTime || 'Travel during daylight hours'
    concerns: analysisData.concerns || null,
    const prompt = `You are a professional travel safety and logistics analyst for East Africa. Provide a comprehensive travel analysis for the route below. Use ONLY the provided data — no assumptions.

ROUTE DETAILS:
- Origin: ${fromLocation}
- Destination: ${toLocation}
- Total Distance: ${distance} kilometers
- Estimated Duration: ${duration} minutes
- Average Speed: ${avgSpeed} km/h
- Travel Mode: Road (driving)

INFRASTRUCTURE & AMENITIES WITHIN 2KM OF DESTINATION:
- Restaurants / Eateries: ${amenities.restaurants} establishments
- Hospitals / Medical Facilities: ${amenities.hospitals} facilities
- Police Stations / Security Posts: ${amenities.police} stations
- Cafes / Rest Stops: ${amenities.cafes} locations

ANALYSIS TASKS (based ONLY on the data above):
1. Security level: Safe if police ≥ 2 and hospitals ≥ 1, Moderate if police = 1 or hospitals = 0, Caution if both police = 0 and hospitals = 0.
2. Write a 2-3 sentence security description referencing the ACTUAL amenity counts.
3. List 3 route highlights derived from the infrastructure data (mention distances, amenity counts, travel time).
4. List 4 practical recommendations for this specific journey (mention actual counts and locations where possible).
5. Suggest the best time of day to travel based on the route distance (${distance} km) and duration (${duration} min).
6. Note any concerns given the infrastructure data.

Respond as VALID JSON ONLY (no markdown, no backticks, no extra text):
{
  "security": {
    "level": "Safe|Moderate|Caution",
    "description": "2-3 sentence assessment mentioning actual amenity counts"
  },
  "highlights": ["Highlight 1 with actual data", "Highlight 2 with actual data", "Highlight 3 with actual data"],
  "recommendations": ["Rec 1", "Rec 2", "Rec 3", "Rec 4"],
  "bestTravelTime": "e.g. Early morning 6-8am for a ${distance}km journey",
  "concerns": "One sentence about any gaps in infrastructure, or null if none"
}`

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
