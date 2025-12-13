// src/pages/admin/AdminDoctorEditor.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import specialtyService from "../../services/specialtyService";
import AdminLayout from "../../components/admin/AdminLayout";
import HospitalSelector from "../hospitals/HospitalSelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDoctorEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bio: "",
    specialty: "",
    picture: null,
    currentHospital: "",
  });

  const [specialties, setSpecialties] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const load = async () => {
      const specs = await specialtyService.getAll();
      setSpecialties(specs);

      const allDocs = await adminService.getDoctors();
      const d = allDocs.find((x) => x._id === id);
      if (!d) return alert("Doctor not found");

      setDoctor(d);
      setForm({
        bio: d.bio || "",
        specialty: d.specialty?._id || "",
        currentHospital: doctor.currentHospital?._id || "",
        picture: null,
      });
    };

    load();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("bio", form.bio);
    fd.append("specialty", form.specialty);
    fd.append("currentHospital", form.currentHospital);
    if (form.picture) fd.append("picture", form.picture);
    if (form.removePicture) fd.append("removePicture", "true");

    await adminService.updateDoctor(id, fd);

    alert("Doctor updated");
    navigate("/admin/doctors");
  };

  const handleHide = () => {
    if (!confirm("Are you sure you want to remove picture?")) return;
    setHide(true);
  }

  if (!doctor) return "Loading...";
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Edit Doctor</h1>

      <form onSubmit={save} className="space-y-5 max-w-xl">
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
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <HospitalSelector
          value={form.currentHospital}
          onChange={(id) => setForm({ ...form, currentHospital: id })}
        />

        {!hide && doctor.picture && !form.picture && (
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">Current picture:</p>
            <img
              src={
                doctor.picture
                  ? `${API_BASE_URL}/uploads/${doctor.picture}`
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

        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/doctors")}
            className="ml-4 underline text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
