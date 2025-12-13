// src/pages/admin/PromoteToDoctor.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import specialtyService from "../../services/specialtyService";
import AdminLayout from "../../components/admin/AdminLayout";

export default function PromoteToDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [specialties, setSpecialties] = useState([]);

  const [form, setForm] = useState({
    bio: "",
    specialty: "",
  });

  useEffect(() => {
    const load = async () => {
      const u = await adminService.getUsers();
      const found = u.users?.find((x) => x._id === id);
      if (!found) return alert("User not found");

      setUser(found);

      const specs = await specialtyService.getAll();
      setSpecialties(specs);
    };

    load();
  }, [id]);

  const promote = async (e) => {
    e.preventDefault();

    await adminService.promote({
      userId: id,
      bio: form.bio,
      specialty: form.specialty,
    });

    alert("User promoted to doctor!");
    navigate("/admin/doctors");
  };

  if (!user) return "Loading...";

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        Promote {user.username} to Doctor
      </h1>

      <form onSubmit={promote} className="space-y-5 max-w-xl">
        <textarea
          className="border p-3 w-full"
          placeholder="Doctor bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        ></textarea>

        <select
          className="border p-3 w-full"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
        >
          <option value="">Select specialty</option>
          {specialties.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Promote
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="ml-4 underline text-gray-700"
        >
          Cancel
        </button>
      </form>
    </AdminLayout>
  );
}
