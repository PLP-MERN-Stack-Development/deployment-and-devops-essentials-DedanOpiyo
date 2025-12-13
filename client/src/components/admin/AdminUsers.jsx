// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const load = () => {
    adminService.getUsers().then((d) => setUsers(d.users));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleUser = async (id) => {
    await adminService.toggleUser(id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">All Users</h1>

      <div className="space-y-4">
        {users.map((u) => (
          <div key={u._id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-gray-600">{u.email}</p>
              <p className="text-gray-500">{u.role}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleUser(u._id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Toggle Active
              </button>

              <button
                onClick={() => navigate(`/admin/users/${u._id}/promote`)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Promote to Doctor
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
