'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    occupation: '',
    interests: '',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const payload = {
        ...form,
        interests: form.interests.split(',').map((s) => s.trim()),
      }
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('token', data.token)
      setMsg('Account created successfully! Redirecting...')
      setTimeout(() => (window.location.href = '/login'), 1500)
    } catch (err: any) {
      setMsg(err?.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center justify-center p-6">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center w-1/2 p-10 text-gray-800 space-y-6">
        <h1 className="text-4xl font-bold leading-tight">
          Join <span className="text-blue-600">CareerCatalyst</span>
        </h1>
        <p className="text-lg text-gray-600">
          Connect with like-minded individuals, grow your skills, and find the right opportunities
          — all in one place.
        </p>
        <img
          src="https://illustrations.popsy.co/gray/remote-work.svg"
          alt="Career Growth"
          className="w-3/4 mx-auto"
        />
      </div>

      {/* Right Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
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

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your occupation</option>
            <option value="student">Student</option>
            <option value="freelancer">Freelancer</option>
            <option value="employee">Employee</option>
            <option value="startup">Startup Owner</option>
          </select>

          <input
            type="text"
            name="interests"
            placeholder="Interests (comma separated, e.g. AI, web dev, data science)"
            value={form.interests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-2 font-medium hover:bg-blue-700 transition"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          {msg && <p className="text-center text-sm text-gray-700 mt-2">{msg}</p>}
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </main>
  )
}
