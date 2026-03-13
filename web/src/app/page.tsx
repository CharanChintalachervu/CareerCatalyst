'use client'
import Link from 'next/link'

const features = [
  {
    icon: '🧠',
    title: 'AI Role Classification',
    desc: 'Our ML model analyses your interests using TF-IDF + Naive Bayes to predict whether you are a Student, Freelancer, or Professional.',
  },
  {
    icon: '📊',
    title: 'Personalised Dashboards',
    desc: 'Each role unlocks a tailored dashboard with relevant opportunities, projects, and connections curated for your profile.',
  },
  {
    icon: '🤝',
    title: 'Smart Connections',
    desc: 'Discover and follow professionals with overlapping interests. Build your network with people who are building the same things.',
  },
  {
    icon: '🚀',
    title: 'Project Marketplace',
    desc: 'Post and explore real collaborative projects. Find teammates, assign tasks, and track progress — all in one place.',
  },
  {
    icon: '⭐',
    title: 'Ratings & Reviews',
    desc: 'Build reputation through peer reviews after collaborations. Your rating follows you across every project you work on.',
  },
  {
    icon: '🔐',
    title: 'Secure Auth',
    desc: 'JWT-based authentication with hashed passwords ensures your account and data stay protected at every step.',
  },
]

const roles = [
  { emoji: '🎓', label: 'Student', color: 'bg-blue-50 border-blue-200 text-blue-700', desc: 'Internships · Learning paths · Mentors' },
  { emoji: '💼', label: 'Freelancer', color: 'bg-amber-50 border-amber-200 text-amber-700', desc: 'Gigs · Clients · Collaborations' },
  { emoji: '🏢', label: 'Employee', color: 'bg-green-50 border-green-200 text-green-700', desc: 'Mentorship · Upskilling · Networking' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#F7F6F3]/90 backdrop-blur border-b border-[#e2e0db] px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Career<span className="text-blue-600">Catalyst</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-white transition">
            Login
          </Link>
          <Link href="/register" className="text-sm font-semibold bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-up">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          ML-Powered Career Intelligence
        </div>
        <h1
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 animate-fade-up delay-100"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Your career,<br />
          <span className="text-blue-600">intelligently guided.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-fade-up delay-200" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          CareerCatalyst uses machine learning to understand your interests and connect you with the right projects, people, and opportunities — automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-300">
          <Link href="/register" className="bg-[#1a1a1a] text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-800 transition">
            Start for free →
          </Link>
          <Link href="/login" className="bg-white border border-[#e2e0db] text-gray-700 px-8 py-3.5 rounded-xl font-semibold text-base hover:border-gray-400 transition">
            I already have an account
          </Link>
        </div>
      </section>

      {/* Role cards */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div key={r.label} className={`border rounded-2xl p-5 text-center ${r.color} transition hover:-translate-y-1`}>
              <div className="text-4xl mb-2">{r.emoji}</div>
              <div className="font-bold text-lg mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{r.label}</div>
              <div className="text-sm opacity-75">{r.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">Our AI automatically classifies your role from your interests</p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Syne, sans-serif' }}>How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Register & select interests', desc: 'Sign up and choose topics you care about — from AI and web dev to design and finance.' },
            { step: '02', title: 'AI classifies your role', desc: 'Our FastAPI microservice runs TF-IDF + MultinomialNB to predict your career profile.' },
            { step: '03', title: 'Get your personalised hub', desc: 'Land on a dashboard built for you — with projects, people, and opportunities that match your role.' },
          ].map((s) => (
            <div key={s.step} className="bg-white border border-[#e2e0db] rounded-2xl p-6">
              <div className="text-4xl font-black text-blue-100 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>{s.step}</div>
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-6 py-8 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Syne, sans-serif' }}>Everything you need to grow</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-[#e2e0db] rounded-2xl p-6 hover:shadow-md transition hover:-translate-y-1">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack strip */}
      <section className="border-t border-[#e2e0db] bg-white py-10 px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Built with</p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-gray-500">
          {['Next.js', 'Express.js', 'MongoDB Atlas', 'FastAPI', 'scikit-learn', 'TailwindCSS', 'JWT Auth'].map(t => (
            <span key={t} className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">{t}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400 border-t border-[#e2e0db]">
        © 2025 CareerCatalyst · Built by Charan Chintalachervu · MIT License
      </footer>
    </div>
  )
}
