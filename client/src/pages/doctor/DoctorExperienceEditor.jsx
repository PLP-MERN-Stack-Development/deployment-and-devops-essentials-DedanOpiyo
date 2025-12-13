// src/pages/doctor/DoctorExperienceEditor.jsx
import { useEffect, useState } from "react";
import experienceService from "../../services/experienceService";
import useAuth from "../../hooks/useAuth";
import HospitalSelector from "../../components/hospitals/HospitalSelector";

export default function DoctorExperienceEditor() {
  const { user } = useAuth();
  const [experienceList, setExperienceList] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    hospitalId: "",
    title: "",
    from: "",
    to: "",
  });

  const load = async () => {
    const exp = await experienceService.getDoctorExperience(user._id);
    setExperienceList(exp);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      hospitalId: form.hospitalId,
      title: form.title,
      from: form.from,
      to: form.to || null,
    };

    if (editing) {
      await experienceService.update(editing, payload);
      setEditing(null);
    } else {
      await experienceService.add(payload);
    }

    setForm({ hospitalId: "", title: "", from: "", to: "" });
    load();
  };

  const startEdit = (exp) => {
    setEditing(exp._id);
    setForm({
      hospitalId: exp.hospital?._id || "",
      title: exp.title,
      from: exp.from?.slice(0, 10),
      to: exp.to?.slice(0, 10) || "",
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this experience?")) return;
    await experienceService.delete(id);
    load();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Work Experience</h1>

      {/* ADD / EDIT FORM */}
      <form onSubmit={submit} className="bg-white p-5 shadow rounded space-y-4">

        {/* HOSPITAL SELECTOR */}
        <HospitalSelector
          value={form.hospitalId}
          onChange={(id) => setForm({ ...form, hospitalId: id })}
        />

        <input
          type="text"
          placeholder="Job Title (e.g. Senior ENT Surgeon)"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <div className="flex gap-4">
          <input
            type="date"
            className="border p-2 rounded w-1/2"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            required
          />
          <input
            type="date"
            className="border p-2 rounded w-1/2"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
        </div>

        <button className="bg-blue-600 text-white py-2 px-4 rounded">
          {editing ? "Update Experience" : "Add Experience"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ hospitalId: "", title: "", from: "", to: "" });
            }}
            className="ml-4 bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* EXPERIENCE LIST */}
      <div className="mt-10 space-y-4">
        {experienceList.map((exp) => (
          <div
            key={exp._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{exp.title}</p>
              <p className="text-gray-600">
                {exp.hospital?.name}
                <br />
                {new Date(exp.from).toDateString()} -{" "}
                {exp.to ? new Date(exp.to).toDateString() : "Present"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => startEdit(exp)}
                className="bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => remove(exp._id)}
                className="bg-red-600 text-white px-3 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// NOTE: Currently hospital creation is restricted to admin (routes/hospitals.js), so
// HospitalSelector will not autocteate from OSMLocationPicker availed detail
// Doctor should rely on search instead. If unavailable fill feedback form, Admin will add the hospital
