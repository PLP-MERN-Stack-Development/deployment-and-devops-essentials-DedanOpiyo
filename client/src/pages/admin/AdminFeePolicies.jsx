// src/pages/admin/AdminFeePolicies.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import specialtyService from "../../services/specialtyService";
import feePolicyService from "../../services/feePolicyService";

export default function AdminFeePolicies() {
  const [specialties, setSpecialties] = useState([]);
  const [policies, setPolicies] = useState([]);

  // Form data for editing
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const specs = await specialtyService.getAll();
    const pols = await feePolicyService.getAll();
    setSpecialties(specs);
    setPolicies(pols);
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();

    if (editing._id) {
      await feePolicyService.update(editing._id, editing);
    } else {
      await feePolicyService.create(editing);
    }

    setEditing(null);
    load();
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this fee policy?")) return;
    await feePolicyService.remove(id);
    load();
  };

  const getPolicyFor = (specId) =>
    policies.find((p) => p.specialty?._id === specId);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Fee Policies</h1>

      {/* List all specialties */}
      <div className="space-y-4">
        {specialties.map((spec) => {
          const policy = getPolicyFor(spec._id);

          return (
            <div key={spec._id} className="border bg-white p-5 rounded shadow">
              <h2 className="text-lg font-semibold">{spec.name}</h2>

              {policy ? (
                <div className="mt-3 space-y-1 text-gray-700">
                  <p>Min Fee: {policy.min}</p>
                  <p>Max Fee: {policy.max}</p>
                  <p>Default Fee: {policy.defaultFee}</p>
                  <p>Allow Patient Input: {policy.allowPatientInputFee ? "Yes" : "No"}</p>
                  <p>Allow Free Service: {policy.allowFreeService ? "Yes" : "No"}</p>

                  <button
                    onClick={() => setEditing({ ...policy })}
                    className="mt-3 px-4 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(policy._id)}
                    className="mt-3 ml-3 px-4 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-gray-500">No policy set.</p>
                  <button
                    onClick={() =>
                      setEditing({
                        specialty: spec._id,
                        min: 0,
                        max: 10000,
                        defaultFee: 500,
                        allowPatientInputFee: false,
                        allowFreeService: true,
                      })
                    }
                    className="mt-3 px-4 py-1 bg-green-600 text-white rounded"
                  >
                    Create Policy
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Editing Form Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={onSave}
            className="bg-white p-6 rounded shadow-xl w-96 space-y-4"
          >
            <h2 className="text-xl font-semibold">
              {editing._id ? "Edit Fee Policy" : "Create Fee Policy"}
            </h2>

            <input
              type="number"
              value={editing.min}
              onChange={(e) =>
                setEditing({ ...editing, min: Number(e.target.value) })
              }
              placeholder="Min Fee"
              className="border p-2 w-full"
            />

            <input
              type="number"
              value={editing.max}
              onChange={(e) =>
                setEditing({ ...editing, max: Number(e.target.value) })
              }
              placeholder="Max Fee"
              className="border p-2 w-full"
            />

            <input
              type="number"
              value={editing.defaultFee}
              onChange={(e) =>
                setEditing({ ...editing, defaultFee: Number(e.target.value) })
              }
              placeholder="Default Fee"
              className="border p-2 w-full"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.allowPatientInputFee}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    allowPatientInputFee: e.target.checked,
                  })
                }
              />
              Allow Patient to Enter Fee
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.allowFreeService}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    allowFreeService: e.target.checked,
                  })
                }
              />
              Allow Free Fee (0)
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                className="px-4 py-1 bg-blue-600 text-white rounded"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// This page:

// ✔ Lists all specialties
// ✔ Shows existing fee policy for each specialty
// ✔ Allows admin to create/update/delete
// ✔ Uses the existing AdminLayout


// Admin Fee Policy System fully integrated!
// What we now have:

// ✔ Admin can add/update/delete fee policies per specialty
// ✔ System enforces min/max, default fees
// ✔ Patient optional fee input controlled by policy
// ✔ Free services allowed/blocked per policy
// ✔ Doctor fee overrides but still bounded
// ✔ BookAppointment stores feeSource for audit transparency
// ✔ Admin UI uses the same design layout and UX as the rest of your system