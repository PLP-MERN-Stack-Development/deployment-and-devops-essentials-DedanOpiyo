// src/pages/admin/AdminLocations.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import locationService from "../../services/locationService";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);

  const load = async () => {
    const data = await locationService.getAll();
    setLocations(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Locations</h1>

      <div className="space-y-4">
        {locations.map((loc) => (
          <div
            key={loc._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">Location ID: {loc._id}</p>
              <p className="text-gray-600">
                Latitude: {loc.latitude}, Longitude: {loc.longitude}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
