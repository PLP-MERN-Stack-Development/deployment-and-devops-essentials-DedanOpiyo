// src/components/admin/AdminSpecialties.jsx
import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import specialtyService from "../../services/specialtyService";

export default function AdminSpecialties() {
  const [specialties, setSpecialties] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const all = await specialtyService.getAll();
    setSpecialties(all);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await specialtyService.create({ name });
    setName("");
    load();
  };

  const update = async (id) => {
    const newName = prompt("New specialty name:");
    if (!newName) return;

    await specialtyService.update(id, { name: newName });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this specialty?")) return;
    await specialtyService.remove(id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Specialties</h1>

      <form onSubmit={create} className="flex gap-3 mb-6">
        <input
          className="border p-2 flex-1"
          placeholder="New specialty..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <div className="space-y-3">
        {specialties.map((s) => (
          <div
            key={s._id}
            className="flex justify-between bg-white shadow p-4 rounded"
          >
            <span>{s.name}</span>

            <div className="space-x-3">
              <button
                onClick={() => update(s._id)}
                className="text-blue-600 underline"
              >
                Edit
              </button>

              <button
                onClick={() => remove(s._id)}
                className="text-red-600 underline"
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
