"use client";

import Link from "next/link";

export default function DashboardLayout({ children, role }: { children: React.ReactNode; role: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm flex justify-between items-center px-6 py-3">
        <h1 className="text-2xl font-bold text-indigo-600">CareerCatalyst</h1>
        <nav className="flex items-center gap-6 text-gray-700">
          <Link href="/projects" className="hover:text-indigo-600">Projects</Link>
          <Link href="/connections" className="hover:text-indigo-600">Connections</Link>
          <Link href="/suggestions" className="hover:text-indigo-600">Suggestions</Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">{children}</div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white shadow-sm border rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Suggested Connections</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✨ Based on your shared interests</li>
              <li>🧠 Data Science Enthusiasts</li>
              <li>💼 ML Hackathon Teams</li>
              <li>📈 Startup Founders</li>
            </ul>
            <Link href="/suggestions" className="text-indigo-600 text-sm hover:underline">
              View all
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
