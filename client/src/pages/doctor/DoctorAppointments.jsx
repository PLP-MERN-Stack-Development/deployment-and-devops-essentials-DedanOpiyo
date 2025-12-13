// src/pages/DoctorAppointments.jsx
import { useEffect, useState } from "react";
import doctorAppointmentService from "../../services/doctorAppointmentService";
import useAuth from "../../hooks/useAuth";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await doctorAppointmentService.getMine();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load doctor appointments", err);
    }
    setLoading(false);
  };

  const markConfirmed = async (id) => {
    await doctorAppointmentService.markConfirmed(id);
    load();
  };

  const markCompleted = async (id) => {
    try {
      await doctorAppointmentService.markCompleted(id);
    } catch (err) {
      console.log("Error marking appointment as complete: ", err);
    }
    load();
  };

  useEffect(() => {
    load();
  }, []);

  if (user?.role !== "doctor")
    return <p className="p-10 text-center">Only doctors can access this page.</p>;

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Appointments</h1>

      {appointments?.length === 0 ? (
        <p className="text-gray-500">No appointments yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments?.map((appt) => (
            <div
              key={appt._id}
              className="border p-4 rounded-lg bg-white shadow-sm flex justify-between"
            >
              {/* left */}
              <div>
                <p className="font-semibold">{appt.patient.username}</p>
                <p className="text-gray-600">
                  {new Date(appt.date).toDateString()} <br />
                  {new Date(appt.date).toTimeString().slice(0, 5)}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
                    ["pending","confirmed"].includes(appt.status)
                      ? "bg-blue-100 text-blue-700"
                      : appt.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              {/* right side controls */}
              {appt.status === "pending" && (
                <button 
                  onClick={() => markConfirmed(appt._id)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded self-start hover:bg-blue-700"
                >
                  Confirm
                </button>
              )}

              {appt.status === "confirmed" && (
                <button 
                  onClick={() => markCompleted(appt._id)} 
                  className="bg-green-600 text-white px-4 py-2 rounded self-start hover:bg-green-700"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Doctor Dashboard: Manage Appointments

// Route:

// /doctor/appointments

// Doctor actions:

// ✔ View all appointments for themselves
// ✔ Filter upcoming / completed / canceled
// ✔ Mark upcoming → completed
// ✔ Cannot modify canceled ones
// ✔ Past completed ones show “completed” badge
