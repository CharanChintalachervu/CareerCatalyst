'use client'

import Navbar from './Navbar'

interface Props {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export default function DashboardLayout({ children, sidebar }: Props) {
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {sidebar ? (
          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <main className="space-y-6">{children}</main>
            <aside className="space-y-5">{sidebar}</aside>
          </div>
        ) : (
          <main className="space-y-6">{children}</main>
        )}
      </div>
    </div>
  )
}
