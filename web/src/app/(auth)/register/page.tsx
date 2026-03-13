'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', occupation: '', interests: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const payload = {
        ...form,
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
      }
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('token', data.token)
      setMsg({ text: 'Account created! Redirecting to interests...', ok: true })
      setTimeout(() => window.location.href = '/interests', 1200)
    } catch (err: any) {
      setMsg({ text: err?.response?.data?.error || 'Registration failed', ok: false })
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
            Join thousands building<br />smarter careers.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Tell us your interests, and our AI will classify your role and match you with the right people and projects.
          </p>
          <div className="space-y-4">
            {[
              { icon: '🧠', label: 'AI classifies your role from interests' },
              { icon: '🎯', label: 'Get a personalised career dashboard' },
              { icon: '🤝', label: 'Connect with matched professionals' },
              { icon: '🚀', label: 'Collaborate on real projects' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-xl">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-xs">© 2025 CareerCatalyst</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Link href="/" className="text-xl font-extrabold" style={{ fontFamily: 'Syne' }}>
              Career<span className="text-blue-600">Catalyst</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Free forever. No credit card needed.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Charan Chintalachervu"
                  className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <input type="tel" required value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Occupation</label>
              <select required value={form.occupation}
                onChange={e => setForm({ ...form, occupation: e.target.value })}
                className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition">
                <option value="">Select your occupation</option>
                <option value="student">🎓 Student</option>
                <option value="freelancer">💼 Freelancer</option>
                <option value="employee">🏢 Employee / Professional</option>
                <option value="startup">🚀 Startup Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Initial Interests <span className="text-gray-400 font-normal">(comma separated)</span></label>
              <input type="text" value={form.interests}
                onChange={e => setForm({ ...form, interests: e.target.value })}
                placeholder="e.g. Machine Learning, Web Dev, Design"
                className="w-full border border-[#e2e0db] bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition" />
              <p className="text-xs text-gray-400 mt-1">You'll refine these on the next screen</p>
            </div>

            {msg && (
              <div className={`text-sm px-4 py-3 rounded-xl ${msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {msg.text}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a1a1a] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
