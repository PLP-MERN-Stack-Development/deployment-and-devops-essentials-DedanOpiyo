// src/pages/admin/AdminDoctors.jsx
import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import AdminLayout from "../../components/admin/AdminLayout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);

  const load = () => {
    adminService.getDoctors().then(setDoctors);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await adminService.deleteDoctor(id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">All Doctors</h1>

      <div className="space-y-4">
        {doctors.map((d) => (
          <div 
            key={d._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div className="flex gap-4 items-center">
              <div className="flex shrink-0">
                {d.picture ? (
                  <img
                    src={
                        d.picture
                        ? `${API_BASE_URL}/uploads/${d.picture}`
                        : "/default-doctor.jpg"
                    }
                    alt={d.username}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No pic</span>
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold">{d.username}</p>
                <p className="text-gray-600">{d.email}</p>
                <p className="text-gray-700">
                  Specialty: {d.specialty?.name || "—"}
                </p>
                <p className="text-gray-500 text-sm">
                  Bio: {d.bio || "No bio added"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Admin editing doctor goes to a dedicated page */}
              <a
                href={`/admin/doctors/${d._id}/edit`}
                className="bg-indigo-600 text-white px-4 py-2 rounded text-center"
                >
                Edit
              </a>

              <button
                onClick={() => deleteDoctor(d._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
