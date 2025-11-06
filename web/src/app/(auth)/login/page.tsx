'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      setMsg('Login successful! Redirecting...')
      setTimeout(() => {
        window.location.href = '/interests' // or directly /dashboard after we add it
      }, 1200)
    } catch (err: any) {
      setMsg(err?.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center justify-center p-6">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center w-1/2 p-10 text-gray-800 space-y-6">
        <h1 className="text-4xl font-bold leading-tight">
          Welcome back to <span className="text-blue-600">CareerCatalyst</span>
        </h1>
        <p className="text-lg text-gray-600">
          Continue your journey — explore projects, connect with professionals, and grow your
          career.
        </p>
      </div>

      {/* Right Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Email or Phone"
            value={form.identifier}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-2 font-medium hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {msg && <p className="text-center text-sm text-gray-700 mt-2">{msg}</p>}
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </main>
  )
}
