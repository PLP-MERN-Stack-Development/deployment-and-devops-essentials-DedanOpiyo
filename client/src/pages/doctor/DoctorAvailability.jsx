// src/pages/DoctorAvailability.jsx
import { useState, useEffect } from "react";
import availabilityService from "../../services/availabilityService";
import useAuth from "../../hooks/useAuth";

export default function DoctorAvailability() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  
  // Add new availability form
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  // Edit availability state
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const loadSlots = async () => {
    const data = await availabilityService.getMine();
    setSlots(data.availabilities || data.slots || []); // depending on your API key (data.availabilities expected)
  };

  useEffect(() => {
    loadSlots();
  }, []);

  // ADD NEW AVAILABILITY
  const addSlot = async (e) => {
    e.preventDefault();
    try {
      await availabilityService.add(form);
      setForm({ date: "", startTime: "", endTime: "" });
      loadSlots();
    } catch (er) {
      setError(er.response.data.message);
      setTimeout(() => setError(""), 3200);
    }
  };

  // DELETE AVAILABILITY
  const deleteSlot = async (id) => {
    await availabilityService.remove(id);
    loadSlots();
  };

  // UPDATE AVAILABILITY
  const saveEdit = async (id) => {
    await availabilityService.update(id, editForm);

    setEditing(null);
    setEditForm({ date: "", startTime: "", endTime: "" });

    loadSlots();
  };

  if (user?.role !== "doctor")
    return <p className="p-6 text-center min-h-[68.8vh]">Only doctors can access this page.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-[68.8vh]">
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>
      
      {error && (
        <div className="text-base mb-6 bg-red-600 text-white p-2 rounded text-center">{error}</div>
      )}

      {/* ADD THIS NOTE HERE */}
      <p className="text-sm bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded mb-4">
        <strong>Note:</strong> Time selection uses a 24-hour format.<br />
        Examples: 1:00 AM → <strong>01:00</strong>, 7:00 PM → <strong>19:00</strong>, 
        10:30 PM → <strong>22:30</strong>, midnight (12:00 AM) → <strong>00:00</strong>.<br />
        Midnight (<strong>00:00</strong>) counts as the <strong>next day</strong> and cannot be used as an end time.
      </p>

      {/* ADD SLOT FORM */}
      <form onSubmit={addSlot} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <input
          type="date"
          className="border p-3 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="time"
          className="border p-3 rounded"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          required
        />
        <input
          type="time"
          className="border p-3 rounded"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          required
        />

        <button className="bg-green-600 text-white rounded px-4 py-2">
          Add
        </button>
      </form>

      {/* EXISTING SLOTS */}
      <h2 className="text-xl font-semibold mb-3">Your Slots</h2>

      {slots.length === 0 ? (
        <p className="text-gray-500">No availability added yet.</p>
      ) : (
        <div className="space-y-4">
          {slots.map((item) => {
            const day = new Date(item.date).toDateString();
            const fullyBooked = item.slots.length === 0;

            return (
              <div
                key={item._id}
                className="border p-4 rounded bg-white shadow-sm"
              >
                {/* Normal View */}
                {editing !== item._id ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{day}</p>
                        
                        {fullyBooked ? (
                          <p className="text-red-600 font-semibold">All slots booked</p>
                        ) : (
                          <p className="text-gray-700">Available slots: {item.slots.join(", ")}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!fullyBooked && (
                          <>
                            <button
                              onClick={() => {
                                setEditing(item._id);
                                setEditForm({
                                  date: item.date.slice(0, 10),
                                  // When editing, show min/max slot time
                                  startTime: item.slots[0],
                                  endTime: item.slots[item.slots.length - 1],
                                });
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteAvailability(item._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* EDIT FORM */
                  <div className="p-4 bg-gray-50 rounded mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        type="date"
                        className="border p-2 rounded"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                      />

                      <input
                        type="time"
                        className="border p-2 rounded"
                        value={editForm.startTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            startTime: e.target.value,
                          })
                        }
                      />

                      <input
                        type="time"
                        className="border p-2 rounded"
                        value={editForm.endTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            endTime: e.target.value,
                          })
                        }
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(item._id)}
                          className="bg-green-600 text-white px-3 py-2 rounded"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditing(null)}
                          className="bg-gray-600 text-white px-3 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Doctor Availability Management (Doctor Dashboard)

// Doctors need to:

// ✔ Add availability
// ✔ Remove availability
// ✔ See which slots are booked

// Route:

// /doctor/availability
// Requires role: doctor
