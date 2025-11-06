'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const predefinedInterests = [
  'Web Development',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'UI/UX Design',
  'Cloud Computing',
  'Cybersecurity',
  'Blockchain',
  'Mobile App Development',
  'Game Development',
  'Content Creation',
  'Marketing',
  'Finance & Investing',
  'Startup & Entrepreneurship',
  'Research',
  'Open Source',
]

export default function InterestsPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !selected.includes(customInterest.trim())) {
      setSelected([...selected, customInterest.trim()])
      setCustomInterest('')
    }
  }

  const handleSubmit = async () => {
    if (selected.length === 0) return setMsg('Please select at least one interest.')

    setLoading(true)
    setMsg(null)
    const token = localStorage.getItem('token')

    try {
      const { data } = await api.post(
        '/ml/classify',
        { interests: selected.join(', ') },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setMsg(`You’ve been classified as a ${data.role}! Redirecting...`)
      setTimeout(() => {
        if (data.role === 'student') window.location.href = '/student'
        else if (data.role === 'freelancer') window.location.href = '/freelancer'
        else if (data.role === 'employee') window.location.href = '/employee'
        else window.location.href = '/startup'
      }, 1500)
    } catch (err: any) {
      setMsg(err?.response?.data?.error || 'Error classifying interests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) window.location.href = '/login'
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Choose Your Interests ✨
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select topics you’re passionate about — we’ll use them to understand your profile
          better and personalize your experience.
        </p>

        {/* Interest Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {predefinedInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`border rounded-xl px-4 py-3 text-center font-medium transition ${
                selected.includes(interest)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>

        {/* Custom Interest Input */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Add your own interest..."
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Selected Interests */}
        {selected.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Your Selected Interests</h2>
            <div className="flex flex-wrap gap-2">
              {selected.map((i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Classifying...' : 'Continue'}
          </button>
          {msg && <p className="mt-4 text-gray-700">{msg}</p>}
        </div>
      </div>
    </main>
  )
}
