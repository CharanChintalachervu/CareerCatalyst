'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const hiringSuggestions = [
  { role: 'Full-Stack Developer', skills: ['Node.js', 'React'], urgent: true },
  { role: 'UI/UX Designer', skills: ['Figma', 'Prototyping'], urgent: false },
  { role: 'ML Engineer', skills: ['Python', 'TensorFlow'], urgent: true },
]

export default function StartupDashboard() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    Promise.all([api.get('/users/me'), api.get('/projects/me'), api.get('/users/suggestions')])
      .then(([u, p, s]) => { setUser(u.data); setProjects(p.data); setSuggestions(s.data.slice(0,4)) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const Sidebar = (
    <>
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl font-bold text-pink-600">{user?.name?.[0]?.toUpperCase()}</div>
          <div><div className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>{user?.name}</div><div className="text-xs text-gray-400">{user?.email}</div></div>
        </div>
        <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">🚀 Startup Founder</span>
      </div>
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Syne' }}>Quick Actions</h3>
        <div className="space-y-2">
          <Link href="/projects/new" className="block w-full text-center text-xs font-semibold bg-[#1a1a1a] text-white py-2 rounded-lg hover:bg-gray-800 transition">+ Post a Project</Link>
          <Link href="/people" className="block w-full text-center text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200 py-2 rounded-lg hover:bg-pink-100 transition">Find Talent</Link>
        </div>
      </div>
    </>
  )

  return (
    <DashboardLayout sidebar={Sidebar}>
      <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pink-100 text-sm mb-1">Founder Mode 🚀</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{user?.name?.split(' ')[0]}'s Dashboard</h1>
            <p className="text-pink-100 text-sm mt-1">Build your team, post projects, grow your startup</p>
          </div>
          <div className="hidden md:block text-6xl">🏗️</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-pink-400/40">
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{projects.length}</div><div className="text-pink-100 text-xs">Projects</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{hiringSuggestions.length}</div><div className="text-pink-100 text-xs">Open Roles</div></div>
          <div><div className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{suggestions.length}</div><div className="text-pink-100 text-xs">Candidates</div></div>
        </div>
      </div>

      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'Syne' }}>👥 Open Hiring Positions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {hiringSuggestions.map(h => (
            <div key={h.role} className="border border-[#e2e0db] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{h.role}</div>
                {h.urgent && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Urgent</span>}
              </div>
              <div className="flex gap-1 flex-wrap mb-3">
                {h.skills.map(s => <span key={s} className="bg-pink-50 text-pink-700 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
              </div>
              <Link href="/people" className="block w-full text-center text-xs font-semibold bg-[#1a1a1a] text-white py-1.5 rounded-lg hover:bg-gray-800 transition">Find Candidates</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>📁 My Projects</h2>
          <Link href="/projects/new" className="text-xs font-semibold bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">+ New</Link>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">No projects yet. <Link href="/projects/new" className="text-pink-600 hover:underline">Create one</Link>.</div>
        ) : (
          <div className="space-y-3">
            {projects.map((p: any) => (
              <div key={p._id} className="flex items-center gap-3 p-3 border border-[#e2e0db] rounded-xl">
                <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center">🚀</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{p.title}</div>
                  <div className="text-xs text-gray-500 truncate">{p.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
