'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      const role = data.user?.role || data.user?.occupation || 'student'
      window.location.href = `/${role}`
    } catch (err: any) {
      setMsg(err?.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1a1a1a] text-white p-12">
        <Link href="/" className="text-xl font-extrabold" style={{ fontFamily: 'Syne' }}>
          Career<span className="text-blue-400">Catalyst</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: 'Syne' }}>
            Welcome back.<br />Let's keep growing.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Your AI-powered career hub is waiting. Projects, people, and opportunities — all in one place.
          </p>
          <div className="mt-10 space-y-3">
            {['Personalised role dashboard', 'AI-matched connections', 'Real project collaborations'].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-xs">© 2025 CareerCatalyst</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-xl font-extrabold" style={{ fontFamily: 'Syne' }}>
              Career<span className="text-blue-600">Catalyst</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>Login</h1>
          <p className="text-gray-500 text-sm mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email or Phone</label>
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={e => setForm({ ...form, identifier: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {msg && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{msg}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
