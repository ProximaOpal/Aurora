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

    const prompt = `Analyze this travel route and provide a detailed travel summary in JSON format:
    
From: ${fromLocation}
To: ${toLocation}
Distance: ${distance} km
Duration: ${duration} minutes
Nearby Amenities - Restaurants: ${amenities.restaurants}, Hospitals: ${amenities.hospitals}, Police Stations: ${amenities.police}, Cafes: ${amenities.cafes}

Provide response as valid JSON (no markdown) with this structure:
{
  "security": {
    "level": "Safe|Moderate|Caution",
    "description": "2-3 sentence security assessment"
  },
  "highlights": ["3-4 key highlights about this route"],
  "recommendations": ["3-4 practical travel recommendations"]
}

Keep responses concise and practical.`

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
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
    })

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
