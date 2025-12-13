// src/pages/doctor/DoctorProfileEditor.jsx
import { useState, useEffect } from "react";
import doctorService from "../../services/doctorService";
import specialtyService from "../../services/specialtyService";
import HospitalSelector from "../../components/hospitals/HospitalSelector";
import useAuth from "../../hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DoctorProfileEditor() {
  const [form, setForm] = useState({
    bio: "",
    specialty: "",
    picture: null,
    currentHospital: "",
  });

  const [doctor, setDoctor] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [hide, setHide] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setDoctor(user);
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        const doctor = await doctorService.getMine();     // NEW method
        const allSpecs = await specialtyService.getAll();
        console.log("doctor: ", doctor)
        
        setSpecialties(allSpecs);
        setForm({
            bio: doctor.bio || "",
            specialty: doctor.specialty?._id || "",
            currentHospital: doctor.currentHospital?._id || "",
            picture: null,
        });
      } catch (err) {
        console.log("err.response.data.message", err)
      }
    };
    load();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("bio", form.bio);
    fd.append("specialty", form.specialty);
    fd.append("currentHospital", form.currentHospital);
    if (form.picture) fd.append("picture", form.picture);
    if (form.removePicture) fd.append("removePicture", "true");

    await doctorService.updateProfile(fd);
    alert("Updated!");
  };

  const handleHide = () => {
    if (!confirm("Are you sure you want to remove picture?")) return;
    setHide(true);
  }

  if (!doctor) return "Loading...";

  return (
    <div className="max-w-xl mx-auto min-h-[68.8vh]">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <form onSubmit={updateProfile} className="space-y-4">
        <textarea
          className="border p-3 w-full"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Bio"
        />

        <select
          className="border p-3 w-full"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
        >
          <option value="">Select specialty</option>
          {specialties.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <HospitalSelector
          value={form.currentHospital}
          onChange={(id) => setForm({ ...form, currentHospital: id })}
        />

        {!hide && doctor?.picture && !form.picture && (
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">Current picture:</p>
            <img
              src={
                doctor?.picture
                  ? `${API_BASE_URL}/uploads/${doctor?.picture}`
                  : "/default-doctor.jpg"
              }
              className="w-32 h-32 object-cover rounded border"
            />

            <button
              type="button"
              className="text-red-600 underline text-sm"
              onClick={() => {handleHide(); setForm({ ...form, picture: null, removePicture: true })}}
            >
              Remove picture
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label className="cursor-pointer bg-gray-200 px-2 py-2 rounded inline-block hover:bg-gray-300">
            Choose Profile Picture
            <input
              key={form.picture ? "with-file" : "no-file"}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setForm({ ...form, picture: e.target.files[0] })}
            />
          </label>

          {form.picture && (
            <div>
              <img
                src={URL.createObjectURL(form.picture)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
              <button
                type="button"
                className="text-red-600 underline text-sm"
                onClick={() => setForm({ ...form, picture: null })}
              >
                Remove picture
              </button>
            </div>
          )}
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}

// Matches backend /api/doctors/profile (PUT + file upload)