"use client";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function StartupDashboard() {
  return (
    <DashboardLayout role="startup">
      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome, Founder 🚀</h2>
        <p className="text-gray-600 mb-4">
          Find skilled developers, designers, and freelancers to join your startup vision.
        </p>
        <Link href="/projects/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Post New Project
        </Link>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Team & Collaborations</h3>
        <p className="text-gray-600 text-sm">Invite others to collaborate on your startup projects.</p>
      </section>
    </DashboardLayout>
  );
}
