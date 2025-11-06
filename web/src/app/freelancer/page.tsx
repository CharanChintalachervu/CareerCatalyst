"use client";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function FreelancerDashboard() {
  return (
    <DashboardLayout role="freelancer">
      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome, Freelancer 💼</h2>
        <p className="text-gray-600 mb-4">
          Showcase your skills, find collaborators, and bid on projects relevant to your interests.
        </p>
        <Link href="/projects/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Create New Project
        </Link>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Active Projects</h3>
        <p className="text-gray-600 text-sm">Start collaborating with other professionals today.</p>
      </section>
    </DashboardLayout>
  );
}
