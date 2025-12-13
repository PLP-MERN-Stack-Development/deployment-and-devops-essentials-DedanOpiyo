// src/pages/admin/AdminHospitals.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import hospitalService from "../../services/hospitalService";
import OSMLocationPicker from "../map/LocationPicker";

export default function AdminHospitals() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const load = async () => {
    const data = await hospitalService.getAll();
    setHospitals(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !selectedLocation) {
      alert("Please fill all fields");
      return;
    }

    const updatedForm = {...form,  
      name: selectedLocation.name ? selectedLocation.name : form.name,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedLocation.address ? selectedLocation.address : form.address,
    }

    await hospitalService.create(updatedForm);
    alert("Hospital added");
    setForm({ name: "", address: "", latitude: null, longitude: null });
    setShowLocationPicker(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this hospital?")) return;
    await hospitalService.delete(id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Manage Hospitals</h1>

      {/* Add Form */}
      <form
        onSubmit={submit}
        className="bg-white p-5 rounded shadow space-y-4 max-w-lg"
      >
        <input
          type="text"
          placeholder="Hospital Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border p-2 rounded"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <button
          type="button"
          onClick={() => setShowLocationPicker(!showLocationPicker)}
          className="bg-gray-700 text-white px-4 py-2 rounded mr-1"
        >
          {showLocationPicker ? "Hide" : "Select Location"}
        </button>

        {showLocationPicker && (
          <OSMLocationPicker onSelect={setSelectedLocation} />
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Hospital
        </button>
      </form>

      {/* Hospital List */}
      <div className="mt-8 space-y-4">
        {hospitals.map((h) => (
          <div
            key={h._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{h.name}</p>
              <p className="text-gray-600">{h.address}</p>
              {h.location && (
                <p className="text-sm text-gray-500">
                  Lat: {h.location.latitude}, Lng: {h.location.longitude}
                </p>
              )}
            </div>

            <button
              onClick={() => remove(h._id)}
              className="bg-red-600 text-white px-3 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
