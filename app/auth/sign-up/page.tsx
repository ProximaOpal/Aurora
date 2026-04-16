'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="relative z-10 p-8 md:p-10">
            <h1 className="text-4xl font-light text-amber-50 mb-2 tracking-wide">
              Join Aurora
            </h1>
            <p className="text-amber-100/60 font-light mb-8">
              Create your account to start exploring
            </p>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-light text-amber-100 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-amber-600/30 rounded-lg text-amber-50 placeholder-amber-100/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-light text-amber-100 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-amber-600/30 rounded-lg text-amber-50 placeholder-amber-100/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="repeat-password"
                  className="block text-sm font-light text-amber-100 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-amber-600/30 rounded-lg text-amber-50 placeholder-amber-100/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-slate-900 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-amber-600/20 text-center">
              <p className="text-sm text-amber-100/60">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-amber-400 hover:text-amber-300 font-light underline underline-offset-2 transition"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
