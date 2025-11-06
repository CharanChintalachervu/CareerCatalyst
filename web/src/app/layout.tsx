import type { Metadata } from 'next'
import '@/styles/globals.css'
export const metadata: Metadata = {
  title: 'CareerCatalyst',
  description: 'Kickstart your role with ML-powered guidance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">CareerCatalyst</h1>
            <nav className="text-sm space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/login" className="hover:underline">Login</a>
              <a href="/register" className="hover:underline">Register</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
