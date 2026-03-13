'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applySlot, setApplySlot] = useState('')
  const [applyMsg, setApplyMsg] = useState('')
  const [applyStatus, setApplyStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchProject = () =>
    api.get(`/projects/${id}`).then(r => setProject(r.data))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    Promise.all([api.get(`/projects/${id}`), api.get('/users/me')])
      .then(([p, u]) => { setProject(p.data); setMe(u.data) })
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    if (!applySlot) return setApplyStatus('Please select a role to apply for.')
    setSubmitting(true)
    setApplyStatus(null)
    try {
      await api.post(`/projects/${id}/apply`, { professionalRole: applySlot, message: applyMsg })
      setApplyStatus('✅ Application submitted! The owner will review it.')
      setApplySlot('')
      setApplyMsg('')
      fetchProject()
    } catch (err: any) {
      setApplyStatus(err?.response?.data?.error || 'Failed to apply.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApplicationAction = async (appId: string, status: 'accepted' | 'rejected') => {
    try {
      await api.patch(`/projects/${id}/applications/${appId}`, { status })
      fetchProject()
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Action failed')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!project) return (
    <DashboardLayout>
      <div className="text-center py-20 text-gray-400">Project not found.</div>
    </DashboardLayout>
  )

  const isOwner = me?._id === project.ownerId?._id
  const myApplication = project.applications?.find((a: any) => a.userId?._id === me?._id)
  const isCollaborator = project.collaborators?.some((c: any) => c.userId?._id === me?._id)
  const openSlots = project.slots?.filter((s: any) => s.filled < s.count) || []
  const pendingApplications = project.applications?.filter((a: any) => a.status === 'pending') || []

  return (
    <DashboardLayout>
      <Link href="/projects" className="text-sm text-gray-400 hover:text-gray-700">← Back to Projects</Link>

      {/* Project Header */}
      <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[project.status]}`}>
                {project.status}
              </span>
              {(project.tags || []).map((t: string) => (
                <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>{project.title}</h1>
            <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#e2e0db] text-sm text-gray-500">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs">
            {project.ownerId?.name?.[0]?.toUpperCase()}
          </div>
          <span>Posted by <span className="font-semibold text-gray-800">{project.ownerId?.name}</span></span>
          <span className="text-gray-300">·</span>
          <span>{new Date(project.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-5">
          {/* Role Slots */}
          <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'Syne' }}>🧩 Roles Needed</h2>
            {project.slots?.length === 0 ? (
              <p className="text-gray-400 text-sm">No specific roles defined for this project.</p>
            ) : (
              <div className="space-y-3">
                {project.slots?.map((slot: any) => {
                  const isFull = slot.filled >= slot.count
                  return (
                    <div key={slot.professionalRole} className={`flex items-center justify-between p-3 rounded-xl border ${isFull ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'}`}>
                      <div>
                        <div className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{slot.professionalRole}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {slot.filled}/{slot.count} filled
                        </div>
                      </div>
                      {isFull ? (
                        <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">Filled</span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{slot.count - slot.filled} open</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Collaborators */}
          {project.collaborators?.length > 0 && (
            <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'Syne' }}>👥 Current Team</h2>
              <div className="space-y-3">
                {/* Owner */}
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-700 text-sm">
                    {project.ownerId?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{project.ownerId?.name}</div>
                    <div className="text-xs text-amber-600">Project Owner</div>
                  </div>
                </div>
                {project.collaborators.map((c: any) => (
                  <div key={c._id} className="flex items-center gap-3 p-3 border border-[#e2e0db] rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">
                      {c.userId?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{c.userId?.name}</div>
                      <div className="text-xs text-blue-600">{c.professionalRole}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner: Pending Applications */}
          {isOwner && pendingApplications.length > 0 && (
            <div className="bg-white border border-[#e2e0db] rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'Syne' }}>
                📬 Pending Applications
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{pendingApplications.length}</span>
              </h2>
              <div className="space-y-3">
                {pendingApplications.map((app: any) => (
                  <div key={app._id} className="border border-[#e2e0db] rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm flex-shrink-0">
                          {app.userId?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{app.userId?.name}</div>
                          <div className="text-xs text-blue-600">{app.professionalRole}</div>
                          {app.message && <p className="text-xs text-gray-500 mt-1">"{app.message}"</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApplicationAction(app._id, 'accepted')}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleApplicationAction(app._id, 'rejected')}
                          className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar: Apply panel */}
        <div className="space-y-4">
          {!isOwner && !isCollaborator && project.status !== 'completed' && (
            <div className="bg-white border border-[#e2e0db] rounded-2xl p-5 sticky top-24">
              <h3 className="font-bold text-base mb-3" style={{ fontFamily: 'Syne' }}>
                {myApplication ? '📋 Your Application' : '🙋 Apply to this Project'}
              </h3>

              {myApplication ? (
                <div className={`text-sm px-4 py-3 rounded-xl ${
                  myApplication.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  myApplication.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <div className="font-semibold capitalize mb-1">{myApplication.status}</div>
                  <div className="text-xs">Applied for: {myApplication.professionalRole}</div>
                  {myApplication.status === 'pending' && <div className="text-xs mt-1 opacity-75">Waiting for the owner to review your application.</div>}
                </div>
              ) : (
                <>
                  {openSlots.length === 0 ? (
                    <p className="text-sm text-gray-400">All slots are currently filled.</p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-gray-600">Apply for role *</label>
                        <select value={applySlot} onChange={e => setApplySlot(e.target.value)}
                          className="w-full border border-[#e2e0db] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition bg-white">
                          <option value="">Select a role...</option>
                          {openSlots.map((s: any) => (
                            <option key={s.professionalRole} value={s.professionalRole}>
                              {s.professionalRole} ({s.count - s.filled} open)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-gray-600">Message (optional)</label>
                        <textarea value={applyMsg} onChange={e => setApplyMsg(e.target.value)}
                          placeholder="Briefly describe your experience..."
                          rows={3}
                          className="w-full border border-[#e2e0db] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition resize-none" />
                      </div>
                      {applyStatus && (
                        <p className={`text-xs px-3 py-2 rounded-lg ${applyStatus.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {applyStatus}
                        </p>
                      )}
                      <button onClick={handleApply} disabled={submitting}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {isCollaborator && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-bold text-green-700 text-sm">You are on this team!</div>
              <div className="text-xs text-green-600 mt-1">
                {project.collaborators.find((c: any) => c.userId?._id === me?._id)?.professionalRole}
              </div>
            </div>
          )}

          {isOwner && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-bold text-amber-700 text-sm">You own this project</div>
              <div className="text-xs text-amber-600 mt-1">Review applications on the left</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
