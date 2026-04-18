'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Calendar, Shield, LogOut } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
        } else {
          setUser(user)
        }
      } catch (error) {
        console.error('[v0] Error fetching user:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('[v0] Sign out error:', error)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-amber-100 font-light">Loading profile...</div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const createdDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      className="min-h-screen bg-slate-950"
      style={{
        backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Black%20Gold%20Gradient%20Line%20Mandala%20Background%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-sQF25jXzZo1uDR10B6AuuRlU50TOxd.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="fixed inset-0 bg-slate-950/70 pointer-events-none" />

      <header className="relative z-50 border-b border-amber-600/30 sticky top-0 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-slate-900 font-light rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-light text-amber-50 tracking-wide">Profile</h1>
          <div className="w-32" />
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Profile Card */}
        <div className="bg-slate-900/60 border-2 border-amber-600/40 rounded-xl overflow-hidden backdrop-blur">
          <div
            className="h-32 bg-cover bg-center relative"
            style={{
              backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Islamic%20Background%20Green%20Mandala%20Patern%20Wallpaper%20Image%20For%20Free%20Download%20-%20Pngtree-XZXrtT4YGmZjUoAr8qzVkzxGL24T3E.jpg)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
          </div>

          <div className="p-8 md:p-12">
            {/* User Avatar & Name */}
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full bg-amber-600/20 border-2 border-amber-600/50 flex items-center justify-center mb-4 -mt-16 relative z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-3xl font-light text-slate-900">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-light text-amber-50 mb-2">Account Information</h2>
              <p className="text-amber-100/60 font-light">Manage your Aurora profile</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Email */}
              <div className="bg-slate-800/40 border border-amber-600/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <label className="text-sm uppercase tracking-widest text-amber-200 font-light">
                    Email Address
                  </label>
                </div>
                <p className="text-amber-50 font-light break-all">{user.email}</p>
              </div>

              {/* Account Created */}
              <div className="bg-slate-800/40 border border-amber-600/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <label className="text-sm uppercase tracking-widest text-amber-200 font-light">
                    Account Created
                  </label>
                </div>
                <p className="text-amber-50 font-light">{createdDate}</p>
              </div>

              {/* User ID */}
              <div className="bg-slate-800/40 border border-amber-600/30 rounded-lg p-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <label className="text-sm uppercase tracking-widest text-amber-200 font-light">
                    User ID
                  </label>
                </div>
                <p className="text-amber-50 font-light text-xs break-all">{user.id}</p>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-slate-800/40 border border-amber-600/30 rounded-lg p-6 mb-8">
              <h3 className="text-sm uppercase tracking-widest text-amber-200 font-light mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-100/70 font-light">Email Verified</span>
                  <span className="text-amber-400 font-light">
                    {user.email_confirmed_at ? '✓ Confirmed' : '○ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-100/70 font-light">Authentication</span>
                  <span className="text-amber-400 font-light">✓ Active</span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-light rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-amber-600/30 rounded-lg p-6 text-center">
            <div className="text-2xl font-light text-amber-400 mb-2">✓</div>
            <p className="text-amber-100/70 font-light text-sm">Data Encrypted</p>
          </div>
          <div className="bg-slate-900/60 border border-amber-600/30 rounded-lg p-6 text-center">
            <div className="text-2xl font-light text-amber-400 mb-2">✓</div>
            <p className="text-amber-100/70 font-light text-sm">Secure Sessions</p>
          </div>
          <div className="bg-slate-900/60 border border-amber-600/30 rounded-lg p-6 text-center">
            <div className="text-2xl font-light text-amber-400 mb-2">✓</div>
            <p className="text-amber-100/70 font-light text-sm">Privacy Protected</p>
          </div>
        </div>
      </main>
    </div>
  )
}
