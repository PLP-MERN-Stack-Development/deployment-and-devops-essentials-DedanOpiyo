// src/pages/admin/AdminBlogs.jsx
import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);

  const load = () => {
    adminService.getBlogs().then((d) => setBlogs(d.blogs));
  };

  useEffect(() => {
    load();
  }, []);

  const removeBlog = async (id) => {
    if (!confirm("Delete this blog?")) return;
    await adminService.deleteBlog(id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No Blogs added yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((b) => (
            <div key={b._id} className="bg-white p-4 rounded shadow flex justify-between">
              <p className="font-semibold">{b.title}</p>

              <button
                onClick={() => removeBlog(b._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
