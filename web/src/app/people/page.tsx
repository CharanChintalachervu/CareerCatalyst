'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'

const occupationBadge: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  freelancer: 'bg-amber-100 text-amber-700',
  employee: 'bg-green-100 text-green-700',
  startup: 'bg-pink-100 text-pink-700',
}

const professionalRoleOptions = [
  'All Roles', 'SDE', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'ML Engineer', 'UI/UX Designer',
  'Product Manager', 'Cybersecurity Analyst', 'Cloud Engineer', 'Mobile Developer',
  'QA Engineer', 'Blockchain Developer', 'Data Engineer', 'Game Developer',
]

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [occupationFilter, setOccupationFilter] = useState('all')
  const [professionalRoleFilter, setProfessionalRoleFilter] = useState('All Roles')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    Promise.all([api.get('/users'), api.get('/users/suggestions')])
      .then(([all, sug]) => { setPeople(all.data); setSuggestions(sug.data) })
      .finally(() => setLoading(false))
  }, [])

  const toggleFollow = async (userId: string) => {
    try {
      if (following.has(userId)) {
        await api.delete(`/follow/${userId}`)
        setFollowing(prev => { const s = new Set(prev); s.delete(userId); return s })
      } else {
        await api.post('/follow', { followingId: userId })
        setFollowing(prev => new Set([...prev, userId]))
      }
    } catch {}
  }

  const filtered = people.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.interests || []).some((i: string) => i.toLowerCase().includes(search.toLowerCase())) ||
      p.professionalRole?.toLowerCase().includes(search.toLowerCase())
    const matchOccupation = occupationFilter === 'all' || (p.role || p.occupation) === occupationFilter
    const matchProfessional = professionalRoleFilter === 'All Roles' || p.professionalRole === professionalRoleFilter
    return matchSearch && matchOccupation && matchProfessional
  })

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne' }}>People</h1>
        <p className="text-gray-500 text-sm mt-1">Discover professionals and potential collaborators</p>
      </div>

      {/* Suggested */}
      {suggestions.length > 0 && (
        <div className="bg-white border border-[#e2e0db] rounded-2xl p-5">
          <h2 className="font-bold text-base mb-4" style={{ fontFamily: 'Syne' }}>✨ Suggested for You</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {suggestions.slice(0, 6).map((s: any) => (
              <div key={s._id} className="flex-shrink-0 w-44 border border-[#e2e0db] rounded-xl p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 mx-auto mb-2">
                  {s.name?.[0]?.toUpperCase()}
                </div>
                <div className="font-semibold text-xs truncate" style={{ fontFamily: 'Syne' }}>{s.name}</div>
                {s.professionalRole && (
                  <div className="text-xs text-blue-600 font-medium truncate mt-0.5">{s.professionalRole}</div>
                )}
                <div className={`text-xs px-2 py-0.5 rounded-full my-1.5 inline-block ${occupationBadge[s.role || s.occupation] || 'bg-gray-100 text-gray-600'}`}>
                  {s.role || s.occupation}
                </div>
                <button onClick={() => toggleFollow(s._id)}
                  className={`w-full text-xs py-1.5 rounded-lg font-semibold transition ${
                    following.has(s._id) ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  {following.has(s._id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, interest, or role..."
          className="flex-1 border border-[#e2e0db] bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
        <select value={professionalRoleFilter} onChange={e => setProfessionalRoleFilter(e.target.value)}
          className="border border-[#e2e0db] bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition">
          {professionalRoleOptions.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={occupationFilter} onChange={e => setOccupationFilter(e.target.value)}
          className="border border-[#e2e0db] bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition">
          <option value="all">All Types</option>
          <option value="student">Students</option>
          <option value="freelancer">Freelancers</option>
          <option value="employee">Employees</option>
          <option value="startup">Startup Founders</option>
        </select>
      </div>

      {/* People grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <div className="text-3xl mb-2">🔍</div>
            <p>No people match your filter.</p>
          </div>
        ) : filtered.map((p: any) => (
          <div key={p._id} className="bg-white border border-[#e2e0db] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">
                {p.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm truncate" style={{ fontFamily: 'Syne' }}>{p.name}</div>
                {p.professionalRole ? (
                  <div className="text-xs text-blue-600 font-medium truncate">{p.professionalRole}</div>
                ) : (
                  <div className="text-xs text-gray-400 capitalize">{p.occupation}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {p.professionalRole && (
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {p.professionalRole}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${occupationBadge[p.role || p.occupation] || 'bg-gray-100 text-gray-600'}`}>
                {p.role || p.occupation || 'Member'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {(p.interests || []).slice(0, 3).map((i: string) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{i}</span>
              ))}
              {(p.interests || []).length > 3 && (
                <span className="text-xs text-gray-400">+{p.interests.length - 3}</span>
              )}
            </div>

            <button onClick={() => toggleFollow(p._id)}
              className={`w-full text-xs py-2 rounded-xl font-semibold transition ${
                following.has(p._id)
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-[#1a1a1a] text-white hover:bg-gray-800'
              }`}>
              {following.has(p._id) ? '✓ Following' : '+ Follow'}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
