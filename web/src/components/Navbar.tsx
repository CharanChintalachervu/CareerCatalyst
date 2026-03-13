'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const roleBadgeMap: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  freelancer: 'bg-amber-100 text-amber-700',
  employee: 'bg-green-100 text-green-700',
  startup: 'bg-pink-100 text-pink-700',
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return
    api.get('/users/me').then(r => setUser(r.data)).catch(() => {})
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const navLinks = [
    { href: `/${user?.role || 'student'}`, label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/people', label: 'People' },
    { href: '/profile', label: 'Profile' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e2e0db] px-6 py-3.5 flex items-center justify-between">
      <Link href="/" className="text-lg font-extrabold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
        Career<span className="text-blue-600">Catalyst</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === link.href
                ? 'bg-[#F7F6F3] text-[#1a1a1a]'
                : 'text-gray-500 hover:text-gray-900 hover:bg-[#F7F6F3]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* User area */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden md:flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadgeMap[user.role] || 'bg-gray-100 text-gray-600'}`}>
              {user.role || user.occupation}
            </span>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
        )}
        <button
          onClick={logout}
          className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
