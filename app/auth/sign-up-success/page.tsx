import Link from 'next/link'

export default function SignUpSuccess() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Mandala */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20%284%29-g1PTPlsX8hZuoixvKFGA1mJw4u4LPe.jpg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl overflow-hidden backdrop-blur-sm"
          style={{
            backgroundImage:
              'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D8%A5%D8%B7%D8%A7%D8%B1-ZDZFxjFKW3I5pcxBjMVbsSqUmEjk2p.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-950/85" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-10 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-600/20 border border-amber-500/50">
                <svg
                  className="w-8 h-8 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-light text-amber-50 mb-3 tracking-wide">
              Account Created
            </h1>
            <p className="text-amber-100/70 font-light mb-2">
              Welcome to Aurora!
            </p>
            <p className="text-amber-100/60 font-light text-sm mb-8">
              Please check your email to confirm your account before signing in.
            </p>

            <Link
              href="/auth/login"
              className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-700 text-slate-900 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
