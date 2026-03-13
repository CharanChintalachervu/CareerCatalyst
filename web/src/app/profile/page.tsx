'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const occupationBadge: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  freelancer: 'bg-amber-100 text-amber-700',
  employee: 'bg-green-100 text-green-700',
  startup: 'bg-pink-100 text-pink-700',
}

const professionalRoleOptions = [
  'SDE', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'ML Engineer', 'UI/UX Designer',
  'Product Manager', 'Cybersecurity Analyst', 'Cloud Engineer', 'Mobile Developer',
  'QA Engineer', 'Blockchain Developer', 'Data Engineer', 'Game Developer',
]

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [reviews, setReviews] = useState<{ reviews: any[]; averageRating: string; count: number }>({ reviews: [], averageRating: '0', count: 0 })
  const [loading, setLoading] = useState(true)
  const [editingRole, setEditingRole] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [roleSaving, setRoleSaving] = useState(false)
  const [roleMsg, setRoleMsg] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const [reviewTarget, setReviewTarget] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    api.get('/users/me').then(r => {
      setUser(r.data)
      setNewRole(r.data.professionalRole || '')
      return Promise.all([api.get('/projects/me'), api.get(`/reviews/user/${r.data._id}`)])
    }).then(([p, r]) => {
      setProjects(p.data)
      setReviews(r.data)
    }).finally(() => setLoading(false))
  }, [])

  const saveRole = async () => {
    const finalRole = useCustom ? customRole.trim() : newRole
    if (!finalRole) return
    setRoleSaving(true)
    try {
      const res = await api.patch('/users/me/professional-role', { professionalRole: finalRole })
      setUser(res.data)
      setEditingRole(false)
      setRoleMsg('✅ Role updated!')
      setTimeout(() => setRoleMsg(''), 2000)
    } catch {
      setRoleMsg('Failed to update role.')
    } finally {
      setRoleSaving(false)
    }
  }

  const submitReview = async () => {
    if (!reviewTarget) return setReviewMsg('Enter a user ID to review.')
    try {
      await api.post('/reviews', { revieweeId: reviewTarget, rating: reviewForm.rating, text: reviewForm.text })
      setReviewMsg('✅ Review submitted!')
      setReviewTarget('')
      setReviewForm({ rating: 5, text: '' })
    } catch (err: any) {
      setReviewMsg(err?.response?.data?.error || 'Failed to submit.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const occupation = user?.role || user?.occupation

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne' }}>My Profile</h1>

      {/* Profile header */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-600 flex-shrink-0" style={{ fontFamily: 'Syne' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>{user?.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email} · {user?.phone}</p>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${occupationBadge[occupation] || 'bg-gray-100 text-gray-600'}`}>
                {occupation}
              </span>
              {user?.professionalRole && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  💼 {user.professionalRole}
                </span>
              )}
              {reviews.count > 0 && (
                <span className="text-xs text-amber-600 font-semibold">⭐ {reviews.averageRating} ({reviews.count} reviews)</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xl font-bold" style={{ fontFamily: 'Syne' }}>{projects.length}</div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xl font-bold" style={{ fontFamily: 'Syne' }}>{(user?.interests || []).length}</div>
              <div className="text-xs text-gray-500">Interests</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xl font-bold" style={{ fontFamily: 'Syne' }}>{reviews.count}</div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Role */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>💼 Professional Role</h2>
          {!editingRole && (
            <button onClick={() => setEditingRole(true)} className="text-sm text-blue-600 hover:underline">Edit</button>
          )}
        </div>

        {!editingRole ? (
          <div>
            {user?.professionalRole ? (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <div className="text-2xl">💼</div>
                <div>
                  <div className="font-bold text-blue-800">{user.professionalRole}</div>
                  <div className="text-xs text-blue-600">Your current professional role</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                No professional role set yet.{' '}
                <button onClick={() => setEditingRole(true)} className="text-blue-600 hover:underline">Set one now</button>
              </div>
            )}
            {roleMsg && <p className="text-sm text-green-600 mt-2">{roleMsg}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {professionalRoleOptions.map(r => (
                <button key={r} type="button"
                  onClick={() => { setNewRole(r); setUseCustom(false) }}
                  className={`border rounded-xl px-3 py-2.5 text-xs font-medium text-center transition ${
                    newRole === r && !useCustom
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-[#e2e0db] hover:border-blue-300'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={useCustom} onChange={e => { setUseCustom(e.target.checked); if (e.target.checked) setNewRole('') }} />
              Enter a custom role
            </label>
            {useCustom && (
              <input value={customRole} onChange={e => setCustomRole(e.target.value)}
                placeholder="e.g. Embedded Systems Engineer"
                className="w-full border border-[#e2e0db] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
            )}
            <div className="flex gap-2">
              <button onClick={saveRole} disabled={roleSaving}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                {roleSaving ? 'Saving...' : 'Save Role'}
              </button>
              <button onClick={() => setEditingRole(false)}
                className="border border-[#e2e0db] text-gray-600 px-5 py-2 rounded-xl text-sm font-semibold hover:border-gray-400 transition">
                Cancel
              </button>
            </div>
            {roleMsg && <p className="text-sm text-red-500">{roleMsg}</p>}
          </div>
        )}
      </div>

      {/* Interests */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'Syne' }}>🎯 My Interests</h2>
        <div className="flex flex-wrap gap-2">
          {(user?.interests || []).map((i: string) => (
            <span key={i} className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full font-medium">{i}</span>
          ))}
        </div>
        <Link href="/interests" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Update interests →</Link>
      </div>

      {/* My Projects */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'Syne' }}>📁 My Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-400 text-sm">No projects yet. <Link href="/projects/new" className="text-blue-600 hover:underline">Create one</Link>.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((p: any) => (
              <Link key={p._id} href={`/projects/${p._id}`}
                className="flex items-center gap-3 p-3 border border-[#e2e0db] rounded-xl hover:border-blue-300 transition block">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">📁</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{p.title}</div>
                  <div className="text-xs text-gray-500 truncate">{p.description}</div>
                </div>
                {(p.applications || []).filter((a: any) => a.status === 'pending').length > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex-shrink-0">
                    {p.applications.filter((a: any) => a.status === 'pending').length} pending
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Reviews received */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>⭐ Reviews Received</h2>
          {reviews.count > 0 && <span className="text-sm font-semibold text-amber-600">{reviews.averageRating}/5 avg</span>}
        </div>
        {reviews.reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.reviews.map((r: any) => (
              <div key={r._id} className="border border-[#e2e0db] rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-semibold text-sm">{r.reviewerId?.name}</span>
                    {r.reviewerId?.professionalRole && (
                      <span className="ml-2 text-xs text-blue-600">{r.reviewerId.professionalRole}</span>
                    )}
                  </div>
                  <span className="text-amber-500 text-sm">{'⭐'.repeat(r.rating)}</span>
                </div>
                {r.text && <p className="text-gray-600 text-sm">{r.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
