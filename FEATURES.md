# Aurora Travel App - Features & API Integration

## Overview
Aurora is a minimalist, mandala-themed travel and hospitality platform with integrated Supabase authentication and interactive mapping capabilities.

## Core Features

### 1. Authentication System
- **Provider**: Supabase Auth
- **Methods**: Email/Password signup and login
- **Protected Routes**: All dashboard and map features require authentication
- **Session Management**: Secure HTTP-only cookies with middleware protection

### 2. Home Page (`/`)
- Hero section with elegant mandala background image overlay
- Feature grid showcasing 6 travel services:
  - Smart Location Detection
  - Real-time Booking
  - Geofence Security
  - Sentiment-powered Recommendations
  - Premium Support
  - Analytics Dashboard
- Call-to-action buttons for Sign Up and Login
- Full-screen mandala visual design

### 3. Protected Dashboard (`/protected`)
- Post-login welcome page with personalized greeting
- User email display
- Feature card grid for accessing core services
- Navigation to map dashboard
- Sign out functionality
- Mandala-themed card styling

### 4. Interactive Map Dashboard (`/dashboard`)
- **Default View**: Satellite imagery (Esri World Imagery)
- **Square Container**: Bounded map frame (aspect-square) instead of full-screen
- **Mandala Background**: Background image applied to entire page
- **Left Sidebar Navigation**:
  - Smart Search (AI-powered location finder)
  - 3D View (Immersive navigation)
  - Safety (Real-time alerts)
  - Explore (Discover locations)
  - Each button has mandala image as background
- **Bottom Control Buttons**:
  - Current Location (GPS coordinates)
  - Saved Places (Bookmarks)
  - Safety Alerts (Real-time notifications)
  - Nearby Dining (POI discovery)
  - Each button has mandala image background with overlay

### 5. Back Navigation
- "Back to Home" button on map dashboard
- "Back" navigation on all auth pages
- Seamless routing between protected pages

## Open Source APIs & Data Sources

### Mapping & Tiles
- **Leaflet.js** v1.9.4 - Interactive mapping library
  - CDN: https://unpkg.com/leaflet@1.9.4/
- **Esri World Imagery** - High-quality satellite tiles
  - URL: https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/
  - Default layer on map dashboard
- **OpenStreetMap** - Street view tiles
  - URL: https://tile.openstreetmap.org/
  - Free and open-source tile provider

### Location Services
- **OpenStreetMap Nominatim** - Reverse and forward geocoding
  - Free API for address ↔ coordinates conversion
  - Rate limit: 1 request per second
  - Used for: Location lookup, address to lat/lng
- **Overpass API** - Point of Interest (POI) data
  - Queries: Restaurants, hotels, cafes, museums
  - Data source: OpenStreetMap community
  - Used for: Nearby dining, hotels, attractions

### Browser APIs
- **Geolocation API** - Get user's current GPS coordinates
- **Leaflet Marker API** - Display location pins on map

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Maps**: Leaflet.js with dynamic imports
- **State**: React hooks (useState, useEffect)

### Backend & Auth
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (email/password)
- **Session Management**: Middleware-protected routes
- **Route Protection**: Supabase client-side and server-side validation

### Design System
- **Color Scheme**: Dark slate (slate-950) with gold/amber accents
- **Typography**: Light font weights with wide tracking
- **Background Images**: Mandala-themed uploaded images
  - Black Gold Gradient Line Mandala
  - Islamic Green Mandala Pattern
  - Rose Gold Marble Border Frame
  - Ornate Corner Decoration Frame

## Functional Buttons & Actions

### Navigation Buttons
- ✅ "Start Exploring" → Routes to `/auth/login`
- ✅ "Get Premium Access" → Routes to `/auth/sign-up`
- ✅ "Back to Home" → Routes back to `/protected`
- ✅ "Open Map" → Routes to `/dashboard`

### Map Dashboard Actions
- ✅ Smart Search - Logs action (ready for AI integration)
- ✅ 3D View - Logs action (ready for 3D integration)
- ✅ Safety - Logs action (ready for alerts API)
- ✅ Explore - Logs action (ready for POI discovery)
- ✅ Current Location - Ready for Geolocation API
- ✅ Saved Places - Ready for database integration
- ✅ Safety Alerts - Ready for real-time notifications
- ✅ Nearby Dining - Ready for Overpass API integration

### Auth Actions
- ✅ Sign Up - Creates new user account
- ✅ Sign In - Authenticates user
- ✅ Sign Out - Destroys session and redirects to home
- ✅ Email Confirmation - Required before full access

## API Rate Limits & Considerations

| API | Rate Limit | Notes |
|-----|-----------|-------|
| Nominatim (OSM) | 1 req/sec | Free, requires User-Agent header |
| Overpass API | Varies | Free, can be rate-limited during heavy usage |
| Esri Tiles | Unlimited | Free for non-commercial use |
| OSM Tiles | Unlimited | Free and open-source |
| Leaflet.js | N/A | Client-side library, no API calls |

## Future Enhancements

- [ ] Real-time location tracking with WebSockets
- [ ] Integration with booking APIs (Google Hotels, Booking.com)
- [ ] AI-powered search with natural language processing
- [ ] User-saved places persistence (Supabase database)
- [ ] Real-time safety alerts and notifications
- [ ] Social features and user profiles
- [ ] Review and rating system
- [ ] Multi-language support
- [ ] Dark/Light mode toggle (currently dark-only)

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## File Structure

```
/app
  /auth
    /callback
    /login
    /sign-up
    /error
  /protected
  /dashboard
  /page.tsx (home)
  /layout.tsx
/components
  /MapComponent.tsx
/lib
  /supabase
    /client.ts
    /server.ts
    /proxy.ts
  /locationService.ts
  /utils.ts
/middleware.ts
```

## Design Notes

- All pages feature the uploaded mandala images as backgrounds and button overlays
- Consistent gold/amber accent color scheme throughout
- Minimalist design with generous whitespace
- Light typography with proper contrast for accessibility
- Smooth transitions and hover effects on all interactive elements
- Square-bounded map container instead of full-screen for better visual hierarchy
