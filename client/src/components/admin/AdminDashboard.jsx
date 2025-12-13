// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await adminService.getStats()
      setStats(data);
    }
    fetchData();
  }, []);

  if (!stats) return "Loading...";

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">System Overview</h1>

      <div className="grid grid-cols-2 gap-6">
        <Card label="Total Users" value={stats.totalUsers} />
        <Card label="Doctors" value={stats.totalDoctors} />
        <Card label="Appointments" value={stats.totalAppointments} />
        <Card label="Completed Appointments" value={stats.completedAppointments} />
      </div>
    </AdminLayout>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p className="text-gray-600">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
