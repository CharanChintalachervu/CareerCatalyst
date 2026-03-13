'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const predefinedInterests = [
  'Web Development', 'Machine Learning', 'Artificial Intelligence', 'Data Science',
  'UI/UX Design', 'Cloud Computing', 'Cybersecurity', 'Blockchain',
  'Mobile App Development', 'Game Development', 'DevOps', 'Open Source',
  'Content Creation', 'Marketing', 'Finance & Investing', 'Startup & Entrepreneurship',
]

const professionalRoles = [
  { label: 'Software Development Engineer', value: 'SDE' },
  { label: 'Frontend Developer', value: 'Frontend Developer' },
  { label: 'Backend Developer', value: 'Backend Developer' },
  { label: 'Full Stack Developer', value: 'Full Stack Developer' },
  { label: 'DevOps Engineer', value: 'DevOps Engineer' },
  { label: 'Data Scientist', value: 'Data Scientist' },
  { label: 'ML Engineer', value: 'ML Engineer' },
  { label: 'UI/UX Designer', value: 'UI/UX Designer' },
  { label: 'Product Manager', value: 'Product Manager' },
  { label: 'Cybersecurity Analyst', value: 'Cybersecurity Analyst' },
  { label: 'Cloud Engineer', value: 'Cloud Engineer' },
  { label: 'Mobile Developer', value: 'Mobile Developer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'Blockchain Developer', value: 'Blockchain Developer' },
  { label: 'Data Engineer', value: 'Data Engineer' },
  { label: 'Game Developer', value: 'Game Developer' },
]

export default function InterestsPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const [professionalRole, setProfessionalRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [useCustomRole, setUseCustomRole] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) window.location.href = '/login'
  }, [])

  const toggleInterest = (i: string) =>
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const addCustom = () => {
    if (customInterest.trim() && !selected.includes(customInterest.trim())) {
      setSelected([...selected, customInterest.trim()])
      setCustomInterest('')
    }
  }

  const handleSubmit = async () => {
    const finalRole = useCustomRole ? customRole.trim() : professionalRole
    if (!finalRole) return setMsg('Please select or enter your professional role.')
    if (selected.length === 0) return setMsg('Please select at least one interest.')

    setLoading(true)
    setMsg(null)
    try {
      const { data } = await api.post('/ml/classify', {
        interests: selected.join(', '),
        professionalRole: finalRole,
      })
      setMsg(`Classified as ${data.role} · ${finalRole}! Redirecting...`)
      setTimeout(() => {
        const role = data.role || 'student'
        window.location.href = `/${role}`
      }, 1200)
    } catch (err: any) {
      setMsg(err?.response?.data?.error || 'Error classifying interests')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-xl font-extrabold" style={{ fontFamily: 'Syne' }}>
            Career<span className="text-blue-600">Catalyst</span>
          </a>
          <h1 className="text-3xl font-bold mt-6 mb-2" style={{ fontFamily: 'Syne' }}>
            {step === 1 ? 'What are you into? ✨' : 'What is your professional role? 💼'}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1
              ? 'Select topics you are passionate about — our AI will use these to predict your profile.'
              : 'This helps match you with the right projects and collaborators.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{s}</div>
              {s < 2 && <div className={`w-16 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#e2e0db] rounded-2xl p-6 shadow-sm">
          {step === 1 ? (
            <>
              {/* Interest grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
                {predefinedInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`border rounded-xl px-3 py-2.5 text-xs font-medium text-center transition ${
                      selected.includes(interest)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white hover:bg-gray-50 border-[#e2e0db] text-gray-700'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {/* Custom interest */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Add your own interest..."
                  value={customInterest}
                  onChange={e => setCustomInterest(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustom()}
                  className="flex-1 border border-[#e2e0db] rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 transition"
                />
                <button onClick={addCustom} className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition">
                  Add
                </button>
              </div>

              {/* Selected chips */}
              {selected.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Selected ({selected.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.map(i => (
                      <span key={i} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        {i}
                        <button onClick={() => toggleInterest(i)} className="ml-1 hover:text-blue-900">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => { if (selected.length === 0) { setMsg('Select at least one interest.'); return; } setMsg(null); setStep(2) }}
                className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition"
              >
                Next: Choose Professional Role →
              </button>
              {msg && <p className="text-center text-sm text-red-500 mt-3">{msg}</p>}
            </>
          ) : (
            <>
              {/* Professional role selection */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                {professionalRoles.map(r => (
                  <button
                    key={r.value}
                    onClick={() => { setProfessionalRole(r.value); setUseCustomRole(false) }}
                    className={`border rounded-xl px-3 py-3 text-xs font-medium text-center transition ${
                      professionalRole === r.value && !useCustomRole
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white hover:bg-gray-50 border-[#e2e0db] text-gray-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Custom role option */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={useCustomRole}
                    onChange={e => { setUseCustomRole(e.target.checked); if (e.target.checked) setProfessionalRole('') }}
                    className="rounded"
                  />
                  My role is not listed above
                </label>
                {useCustomRole && (
                  <input
                    type="text"
                    placeholder="e.g. Embedded Systems Engineer"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    className="w-full border border-[#e2e0db] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition"
                  />
                )}
              </div>

              {/* Selected summary */}
              {(professionalRole || (useCustomRole && customRole)) && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
                  <span className="font-semibold">Your role:</span> {useCustomRole ? customRole : professionalRole}
                </div>
              )}

              {msg && <p className="text-center text-sm text-red-500 mb-3">{msg}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-[#e2e0db] text-gray-700 py-3 rounded-xl font-semibold text-sm hover:border-gray-400 transition">
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-2 flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? 'Classifying...' : 'Get My Dashboard →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
