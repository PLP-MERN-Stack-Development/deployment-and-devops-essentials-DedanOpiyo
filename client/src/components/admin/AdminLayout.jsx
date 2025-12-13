// src/components/admin/AdminLayout.jsx
import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>

        <nav className="space-y-3">
          <Link to="/admin" className="block hover:text-blue-400">Dashboard</Link>
          <Link to="/admin/users" className="block hover:text-blue-400">Users</Link>
          <Link to="/admin/doctors" className="block hover:text-blue-400">Doctors</Link>
          <Link to="/admin/blogs" className="block hover:text-blue-400">Blogs</Link>
          <Link to="/admin/specialties" className="block hover:text-blue-400">Specialties</Link> {/* NEW */}
          <Link to="/categories" className="block hover:text-blue-400">Categories</Link>
          <Link to="/admin/hospitals" className="block hover:text-blue-400">Hospitals</Link>
          <Link to="/admin/locations" className="block hover:text-blue-400">Locations</Link>
          <Link to="/admin/help/parts" className="block hover:text-blue-400">Help Parts</Link>
          <Link to="/admin/help/issues" className="block hover:text-blue-400">Help Issues</Link>
          <Link to="/admin/fee-policies" className="block hover:text-blue-400">Fee Policies</Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}

// Admin Sidebar Layout