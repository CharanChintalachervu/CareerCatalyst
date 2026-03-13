'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
}

const roleOptions = [
  'All Roles', 'SDE', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'ML Engineer', 'UI/UX Designer',
  'Product Manager', 'Cloud Engineer', 'Mobile Developer',
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [mine, setMine] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'mine'>('all')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    Promise.all([api.get('/projects'), api.get('/projects/me')])
      .then(([all, my]) => { setProjects(all.data); setMine(my.data) })
      .finally(() => setLoading(false))
  }, [])

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await api.delete(`/projects/${id}`)
    setProjects(prev => prev.filter(p => p._id !== id))
    setMine(prev => prev.filter(p => p._id !== id))
  }

  const base = tab === 'all' ? projects : mine
  const displayed = base.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All Roles' ||
      (p.slots || []).some((s: any) => s.professionalRole === roleFilter)
    return matchSearch && matchRole
  })

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne' }}>Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Browse open projects and apply for a role</p>
        </div>
        <Link href="/projects/new" className="bg-[#1a1a1a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition">
          + New Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border border-[#e2e0db] rounded-xl p-1 gap-1 w-fit">
        {(['all', 'mine'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-[#1a1a1a] text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            {t === 'all' ? `All (${projects.length})` : `My Projects (${mine.length})`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="flex-1 border border-[#e2e0db] bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="border border-[#e2e0db] bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition">
          {roleOptions.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Projects grid */}
      {displayed.length === 0 ? (
        <div className="bg-white border border-[#e2e0db] rounded-2xl p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">📂</div>
          <p className="font-medium">{tab === 'mine' ? "You haven't created any projects yet." : 'No projects match your filter.'}</p>
          <Link href="/projects/new" className="mt-4 inline-block bg-[#1a1a1a] text-white text-sm px-5 py-2 rounded-xl">Create one now</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((p: any) => {
            const openSlots = (p.slots || []).filter((s: any) => s.filled < s.count)
            return (
              <Link key={p._id} href={`/projects/${p._id}`}
                className="bg-white border border-[#e2e0db] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition block">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                  {tab === 'mine' && (
                    <button onClick={e => { e.preventDefault(); deleteProject(p._id) }}
                      className="text-xs text-red-400 hover:text-red-600 transition">Delete</button>
                  )}
                </div>
                <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'Syne' }}>{p.title}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.description}</p>

                {/* Open role slots */}
                {openSlots.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1.5 font-medium">Open roles:</p>
                    <div className="flex flex-wrap gap-1">
                      {openSlots.slice(0, 3).map((s: any) => (
                        <span key={s.professionalRole} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">
                          {s.professionalRole}
                        </span>
                      ))}
                      {openSlots.length > 3 && <span className="text-xs text-gray-400">+{openSlots.length - 3} more</span>}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(p.tags || []).slice(0, 3).map((t: string) => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-[#e2e0db] pt-3 mt-auto">
                  <span>by {p.ownerId?.name || 'Unknown'}</span>
                  <span className="text-blue-600 font-medium">View →</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
