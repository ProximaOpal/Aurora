'use client';

import { MapPin, Hotel, Plane, Shield, Utensils, Navigation } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: 'Smart Locations',
      description: 'Discover geotagged insights for every destination',
      image: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-g1PTPlsX8hZuoixvKFGA1mJw4u4LPe.jpg)',
    },
    {
      icon: Hotel,
      title: 'Premium Stays',
      description: 'Book accommodations with exclusive partnerships',
      image: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D8%A5%D8%B7%D8%A7%D8%B1-ZDZFxjFKW3I5pcxBjMVbsSqUmEjk2p.jpg)',
    },
    {
      icon: Plane,
      title: 'Travel Plans',
      description: 'Seamless flight and transport booking',
      image: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%285%29-vfKxarfoaPCPV3H1Th3bXOvZXvVJmx.jpg)',
    },
    {
      icon: Shield,
      title: 'Travel Safe',
      description: 'Real-time security alerts and geofencing',
      image: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-g1PTPlsX8hZuoixvKFGA1mJw4u4LPe.jpg)',
    },
    {
      icon: Utensils,
      title: 'Trending Eats',
      description: 'Sentiment-powered restaurant recommendations',
      image: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D8%A5%D8%B7%D8%A7%D8%B1-ZDZFxjFKW3I5pcxBjMVbsSqUmEjk2p.jpg)',
    },
    {
      icon: Navigation,
      title: 'Premium Access',
      description: 'Unlock safety features and offline AI maps',
      image: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%285%29-vfKxarfoaPCPV3H1Th3bXOvZXvVJmx.jpg)',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-g1PTPlsX8hZuoixvKFGA1mJw4u4LPe.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-light text-amber-50 mb-4 tracking-wide">
            Travel Reimagined
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/70 font-light max-w-2xl mx-auto mb-8">
            Geotagged intelligence for the modern traveler
          </p>
          <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-slate-900 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Exploring
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-light text-center text-amber-50 mb-16 tracking-wide">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105 h-80"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: feature.image,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 transition-colors duration-300" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                    <Icon className="w-16 h-16 text-amber-400 mb-4 transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="text-2xl font-light text-amber-50 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-amber-100/70 font-light text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden h-96 relative group"
            style={{
              backgroundImage:
                'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%285%29-vfKxarfoaPCPV3H1Th3bXOvZXvVJmx.jpg)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/60 transition-colors duration-300" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-4xl md:text-5xl font-light text-amber-50 mb-6">
                Join 10,000+ Travelers
              </h2>
              <p className="text-amber-100/70 font-light text-lg mb-8 max-w-lg">
                Experience intelligent, context-aware travel recommendations powered by real-time data
              </p>
              <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-slate-900 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Premium Access
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
