'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Loading your dashboard...</div>

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.name || 'Student'} 👋</h1>
      <p className="text-gray-600 mb-8">Your personalized learning and growth hub</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card title="🎯 Recommended Internships" desc="Curated opportunities matching your interests." />
        <Card title="📚 Learning Roadmap" desc="Step-by-step guide to upskill based on your goals." />
        <Card title="🤝 Connect with Mentors" desc="Find experienced professionals who can guide you." />
      </div>

      <button
        className="mt-8 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        onClick={() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }}
      >
        Logout
      </button>
    </main>
  )
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  )
}
