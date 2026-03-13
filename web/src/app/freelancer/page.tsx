'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const gigs = [
  { title: 'React Developer for SaaS MVP', budget: '₹25,000', duration: '1 month', tags: ['React', 'Tailwind', 'API'] },
  { title: 'ML Model Integration (Python)', budget: '₹18,000', duration: '2 weeks', tags: ['Python', 'FastAPI'] },
  { title: 'Mobile App UI (Figma to Flutter)', budget: '₹30,000', duration: '3 weeks', tags: ['Flutter', 'Figma'] },
  { title: 'Full-Stack Web App', budget: '₹40,000', duration: '6 weeks', tags: ['Node.js', 'Next.js', 'MongoDB'] },
]

export default function FreelancerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }

    Promise.all([
      api.get('/users/me'),
      api.get('/projects/me'),
      api.get('/users/suggestions'),
    ])
      .then(([u, p, s]) => {
        setUser(u.data)
        setProjects(p.data)
        setSuggestions(s.data.slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const Sidebar = (
    <>
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-amber-600" style={{ fontFamily: 'Syne' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {(user?.interests || []).slice(0, 4).map((i: string) => (
            <span key={i} className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full">{i}</span>
          ))}
        </div>
        <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">💼 Freelancer</span>
      </div>

      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Syne' }}>Potential Clients</h3>
        <div className="space-y-3">
          {suggestions.map((s: any) => (
            <div key={s._id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-sm font-bold text-amber-600">
                {s.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{s.name}</div>
                <div className="text-xs text-gray-400 capitalize">{s.role || s.occupation}</div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/people" className="text-amber-600 text-xs font-medium mt-3 block hover:underline">Explore people →</Link>
      </div>

      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Syne' }}>Quick Actions</h3>
        <div className="space-y-2">
          <Link href="/projects/new" className="block w-full text-center text-xs font-semibold bg-[#1a1a1a] text-white py-2 rounded-lg hover:bg-gray-800 transition">+ Post a Project</Link>
          <Link href="/people" className="block w-full text-center text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 py-2 rounded-lg hover:bg-amber-100 transition">Find Collaborators</Link>
        </div>
      </div>
    </>
  )

  return (
    <DashboardLayout sidebar={Sidebar}>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm mb-1">Welcome back 👋</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{user?.name?.split(' ')[0]}'s Studio</h1>
            <p className="text-amber-100 text-sm mt-1">Your freelance command centre</p>
          </div>
          <div className="hidden md:block text-6xl">💼</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-amber-400/40">
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{projects.length}</div><div className="text-amber-100 text-xs">My Projects</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>₹0</div><div className="text-amber-100 text-xs">Earnings</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{suggestions.length}</div><div className="text-amber-100 text-xs">Connections</div></div>
        </div>
      </div>

      {/* Available Gigs */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>🔍 Available Gigs</h2>
          <span className="text-xs text-gray-400">Matched to your skills</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {gigs.map((g) => (
            <div key={g.title} className="border border-[#e2e0db] rounded-xl p-4 hover:border-amber-300 hover:shadow-sm transition">
              <div className="font-semibold text-sm mb-1" style={{ fontFamily: 'Syne' }}>{g.title}</div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span className="text-green-600 font-semibold">{g.budget}</span>
                <span>· {g.duration}</span>
              </div>
              <div className="flex gap-1 flex-wrap mb-3">
                {g.tags.map(t => <span key={t} className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
              <button className="w-full text-xs font-semibold bg-amber-500 text-white py-1.5 rounded-lg hover:bg-amber-600 transition">Bid Now</button>
            </div>
          ))}
        </div>
      </div>

      {/* My Projects */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>📁 My Projects</h2>
          <Link href="/projects/new" className="text-xs font-semibold bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">+ New</Link>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">📂</div>
            <p className="text-sm">No projects yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p: any) => (
              <div key={p._id} className="flex items-center gap-3 p-3 border border-[#e2e0db] rounded-xl">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-lg">📁</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ fontFamily: 'Syne' }}>{p.title}</div>
                  <div className="text-xs text-gray-500 truncate">{p.description}</div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
