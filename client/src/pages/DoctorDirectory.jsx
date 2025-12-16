// src/pages/DoctorDirectory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import doctorService from "../services/doctorService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await doctorService.getAll();
        setDoctors(data);
      } catch (err) {
        console.error("Error loading doctors", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p className="text-center min-h-[68.8vh] mt-10">Loading doctors...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Doctors</h1>

      {doctors.length === 0 ? (
        <p className="text-gray-500">No Doctors added yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {doctors && doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={
                  doc.picture
                    ? `${API_BASE_URL}/uploads/${doc.picture}`
                    : "/default-doctor.jpg"
                }
                alt={doc.name}
                className="w-full h-40 object-cover rounded"
              />

              <h2 className="text-xl font-semibold mt-4">{doc.name}</h2>
              <p className="text-gray-500">{doc.specialty?.name}</p>

              <p className="mt-2 text-sm text-gray-700">
                {doc.bio?.substring(0, 100)}...
              </p>

              <a
                href={`/doctor/${doc._id}`}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Profile
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
