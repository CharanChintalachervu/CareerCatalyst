"use client";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function EmployeeDashboard() {
  return (
    <DashboardLayout role="employee">
      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome, Professional 🏢</h2>
        <p className="text-gray-600 mb-4">
          Stay updated with corporate trends, upskill, and mentor upcoming talent in your domain.
        </p>
        <Link href="/projects/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Create New Project
        </Link>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Mentorship & Opportunities</h3>
        <p className="text-gray-600 text-sm">Explore mentorship requests from students and freelancers.</p>
      </section>
    </DashboardLayout>
  );
}
