// src/pages/admin/AdminHelpParts.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import helpService from "../../services/helpService";

export default function AdminHelpParts() {
  const [parts, setParts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = async () => setParts(await helpService.getParts());

  useEffect(() => { load(); }, []);

  const create = async () => {
    await helpService.createPart({ name, description });
    setName(""); setDescription("");
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Help Parts</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <input className="border p-2 rounded w-full"
            placeholder="New Help Part Name"
            value={name} onChange={e => setName(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full mt-2"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button
            onClick={create}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
          >
            Add Part
          </button>
        </div>

        {parts.map((p) => (
          <div key={p._id} className="bg-gray-50 border p-4 rounded">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-gray-600">{p.description}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
