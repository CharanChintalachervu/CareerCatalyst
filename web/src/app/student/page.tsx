'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const internships = [
  { company: 'Google', role: 'ML Intern', location: 'Bangalore', type: 'Remote', tags: ['Python', 'TensorFlow'] },
  { company: 'Razorpay', role: 'Backend Intern', location: 'Hyderabad', type: 'Hybrid', tags: ['Node.js', 'MongoDB'] },
  { company: 'Zepto', role: 'Frontend Intern', location: 'Mumbai', type: 'On-site', tags: ['React', 'TypeScript'] },
  { company: 'Swiggy', role: 'Data Science Intern', location: 'Bangalore', type: 'Remote', tags: ['Python', 'Pandas'] },
]

const roadmap = [
  { step: 'DSA Fundamentals', done: true },
  { step: 'Web Development Basics', done: true },
  { step: 'Build 2 Projects', done: false },
  { step: 'Open Source Contribution', done: false },
  { step: 'Apply for Internships', done: false },
]

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }

    Promise.all([
      api.get('/users/me'),
      api.get('/projects'),
      api.get('/users/suggestions'),
    ])
      .then(([u, p, s]) => {
        setUser(u.data)
        setProjects(p.data.slice(0, 3))
        setSuggestions(s.data.slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
    </div>
  )

  const Sidebar = (
    <>
      {/* Profile card */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600" style={{ fontFamily: 'Syne' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {(user?.interests || []).slice(0, 4).map((i: string) => (
            <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{i}</span>
          ))}
        </div>
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">🎓 Student</span>
      </div>

      {/* Suggested People */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Syne' }}>People you might know</h3>
        <div className="space-y-3">
          {suggestions.length === 0 && <p className="text-xs text-gray-400">No suggestions yet.</p>}
          {suggestions.map((s: any) => (
            <div key={s._id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                {s.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{s.name}</div>
                <div className="text-xs text-gray-400 capitalize">{s.role || s.occupation}</div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/people" className="text-blue-600 text-xs font-medium mt-3 block hover:underline">View all →</Link>
      </div>

      {/* Learning roadmap */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Syne' }}>Learning Roadmap</h3>
        <div className="space-y-2">
          {roadmap.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${r.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {r.done ? '✓' : '○'}
              </span>
              <span className={r.done ? 'line-through text-gray-400' : 'text-gray-700'}>{r.step}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <DashboardLayout sidebar={Sidebar}>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Good day 👋</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-blue-100 text-sm mt-1">Your personalized learning and growth hub</p>
          </div>
          <div className="hidden md:block text-6xl">🎓</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-400/40">
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{projects.length}</div><div className="text-blue-100 text-xs">Projects</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{(user?.interests || []).length}</div><div className="text-blue-100 text-xs">Interests</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{suggestions.length}</div><div className="text-blue-100 text-xs">Connections</div></div>
        </div>
      </div>

      {/* Recommended internships */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>🎯 Recommended Internships</h2>
          <span className="text-xs text-gray-400">Curated for you</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {internships.map((j) => (
            <div key={j.role + j.company} className="border border-[#e2e0db] rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{j.role}</div>
                  <div className="text-xs text-gray-500">{j.company} · {j.location}</div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{j.type}</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {j.tags.map(t => <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
              <button className="mt-3 w-full text-xs font-semibold bg-[#1a1a1a] text-white py-1.5 rounded-lg hover:bg-gray-800 transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>🚀 Recent Projects</h2>
          <Link href="/projects" className="text-blue-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">📂</div>
            <p className="text-sm">No projects yet. Start collaborating!</p>
            <Link href="/projects" className="mt-3 inline-block bg-[#1a1a1a] text-white text-xs px-4 py-2 rounded-lg">Browse Projects</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p: any) => (
              <div key={p._id} className="flex items-start gap-3 p-3 border border-[#e2e0db] rounded-xl hover:border-gray-300 transition">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📁</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ fontFamily: 'Syne' }}>{p.title}</div>
                  <div className="text-xs text-gray-500 truncate">{p.description}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {(p.tags || []).slice(0, 3).map((t: string) => <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">{p.ownerId?.name || 'Unknown'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
