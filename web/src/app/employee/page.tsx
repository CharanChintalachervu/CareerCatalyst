'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const trendingTopics = [
  { topic: 'Generative AI in Enterprise', reads: '12k' },
  { topic: 'DevOps Best Practices 2025', reads: '8.4k' },
  { topic: 'System Design at Scale', reads: '7.1k' },
  { topic: 'Tech Lead Handbook', reads: '5.9k' },
]

const mentorRequests = [
  { name: 'Arjun Sharma', interest: 'Backend Engineering', year: '3rd Year' },
  { name: 'Priya Nair', interest: 'Data Science', year: '4th Year' },
  { name: 'Rohan Kumar', interest: 'DevOps', year: '2nd Year' },
]

export default function EmployeeDashboard() {
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
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const Sidebar = (
    <>
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-600" style={{ fontFamily: 'Syne' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {(user?.interests || []).slice(0, 4).map((i: string) => (
            <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{i}</span>
          ))}
        </div>
        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">🏢 Professional</span>
      </div>

      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Syne' }}>Mentorship Requests</h3>
        <div className="space-y-3">
          {mentorRequests.map((m) => (
            <div key={m.name} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-sm font-bold text-green-600">
                {m.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">{m.name}</div>
                <div className="text-xs text-gray-400">{m.interest} · {m.year}</div>
              </div>
              <button className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-200 transition">Accept</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Syne' }}>Trending in Tech</h3>
        <div className="space-y-2">
          {trendingTopics.map((t) => (
            <div key={t.topic} className="flex items-center justify-between">
              <span className="text-xs text-gray-700 leading-tight">{t.topic}</span>
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{t.reads}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <DashboardLayout sidebar={Sidebar}>
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm mb-1">Hello there 👋</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>Welcome, {user?.name?.split(' ')[0]}</h1>
            <p className="text-green-100 text-sm mt-1">Stay sharp, mentor others, grow your network</p>
          </div>
          <div className="hidden md:block text-6xl">🏢</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-green-400/40">
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{projects.length}</div><div className="text-green-100 text-xs">Projects</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{mentorRequests.length}</div><div className="text-green-100 text-xs">Mentee Requests</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{suggestions.length}</div><div className="text-green-100 text-xs">Connections</div></div>
        </div>
      </div>

      {/* Mentorship section */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>🎓 Mentor Someone Today</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {mentorRequests.map((m) => (
            <div key={m.name} className="border border-[#e2e0db] rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-600 mb-2">{m.name[0]}</div>
              <div className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{m.name}</div>
              <div className="text-xs text-gray-500 mb-1">{m.year}</div>
              <div className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full inline-block mb-3">{m.interest}</div>
              <button className="w-full text-xs font-semibold bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition">Accept Request</button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>🤝 Open Collaborations</h2>
          <Link href="/projects" className="text-green-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No projects found yet.</div>
        ) : (
          <div className="space-y-3">
            {projects.map((p: any) => (
              <div key={p._id} className="flex items-start gap-3 p-3 border border-[#e2e0db] rounded-xl hover:border-gray-300 transition">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">🚀</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{p.title}</div>
                  <div className="text-xs text-gray-500 truncate">{p.description}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {(p.tags || []).slice(0, 3).map((t: string) => <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
