'use client'
import { useState } from 'react'
import { api } from '@/lib/api'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const tagSuggestions = ['React', 'Node.js', 'Python', 'ML', 'FastAPI', 'MongoDB', 'TypeScript', 'Flutter', 'DevOps', 'UI/UX', 'Blockchain', 'Data Science']

const roleOptions = [
  'SDE', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'ML Engineer', 'UI/UX Designer',
  'Product Manager', 'Cybersecurity Analyst', 'Cloud Engineer',
  'Mobile Developer', 'QA Engineer', 'Blockchain Developer', 'Data Engineer',
]

interface Slot { professionalRole: string; count: number }

export default function NewProjectPage() {
  const [form, setForm] = useState({ title: '', description: '', tags: '' })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [newSlot, setNewSlot] = useState({ professionalRole: '', count: 1 })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const toggleTag = (t: string) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const addSlot = () => {
    if (!newSlot.professionalRole) return
    if (slots.find(s => s.professionalRole === newSlot.professionalRole)) return
    setSlots([...slots, { ...newSlot }])
    setNewSlot({ professionalRole: '', count: 1 })
  }

  const removeSlot = (role: string) =>
    setSlots(slots.filter(s => s.professionalRole !== role))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      const customTags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      const allTags = [...new Set([...selectedTags, ...customTags])]
      await api.post('/projects', { ...form, tags: allTags, slots })
      setMsg({ text: '✅ Project created successfully!', ok: true })
      setTimeout(() => window.location.href = '/projects', 1200)
    } catch (err: any) {
      setMsg({ text: err?.response?.data?.error || 'Failed to create project', ok: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-2 mb-2">
        <Link href="/projects" className="text-gray-400 hover:text-gray-700 text-sm">← Back to Projects</Link>
      </div>
      <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne' }}>Create a New Project</h1>
      <p className="text-gray-500 text-sm mb-6">Post your idea, define the team you need, and find collaborators</p>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-[#e2e0db] rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-base" style={{ fontFamily: 'Syne' }}>Project Details</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">Project Title *</label>
              <input required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. AI-Powered Resume Analyser"
                className="w-full border border-[#e2e0db] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description *</label>
              <textarea required value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your project, what problem it solves, and what you're building..."
                rows={4}
                className="w-full border border-[#e2e0db] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tech Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tagSuggestions.map(t => (
                  <button type="button" key={t} onClick={() => toggleTag(t)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                      selectedTags.includes(t)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-[#e2e0db] hover:border-blue-300'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="Or type custom tags, comma separated..."
                className="w-full border border-[#e2e0db] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition" />
            </div>
          </div>

          {/* Role Slots */}
          <div className="bg-white border border-[#e2e0db] rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-bold text-base" style={{ fontFamily: 'Syne' }}>Team Slots Needed</h2>
              <p className="text-xs text-gray-400 mt-0.5">Define which professional roles you need on this project</p>
            </div>

            {/* Add slot row */}
            <div className="flex gap-2 flex-wrap">
              <select value={newSlot.professionalRole}
                onChange={e => setNewSlot({ ...newSlot, professionalRole: e.target.value })}
                className="flex-1 border border-[#e2e0db] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition bg-white">
                <option value="">Select a role...</option>
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="flex items-center gap-2 border border-[#e2e0db] rounded-xl px-3 bg-white">
                <span className="text-xs text-gray-500">Count:</span>
                <input type="number" min={1} max={10} value={newSlot.count}
                  onChange={e => setNewSlot({ ...newSlot, count: Number(e.target.value) })}
                  className="w-12 text-sm outline-none py-2.5 text-center bg-transparent" />
              </div>
              <button type="button" onClick={addSlot}
                className="bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-blue-700 transition">
                + Add
              </button>
            </div>

            {/* Slots list */}
            {slots.length === 0 ? (
              <div className="border border-dashed border-[#e2e0db] rounded-xl p-4 text-center text-sm text-gray-400">
                No slots added yet. Add the roles you need above.
              </div>
            ) : (
              <div className="space-y-2">
                {slots.map(s => (
                  <div key={s.professionalRole} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-blue-800">{s.professionalRole}</span>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">{s.count} needed</span>
                    </div>
                    <button type="button" onClick={() => removeSlot(s.professionalRole)}
                      className="text-red-400 hover:text-red-600 text-sm transition">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {msg && (
            <div className={`text-sm px-4 py-3 rounded-xl ${msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-60">
            {loading ? 'Creating...' : 'Create Project →'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
