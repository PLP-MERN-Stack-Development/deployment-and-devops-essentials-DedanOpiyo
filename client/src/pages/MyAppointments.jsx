// src/pages/MyAppointments.jsx
import { useEffect, useState } from "react";
import appointmentService from "../services/appointmentService";
import ReviewForm from "../components/ReviewForm";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await appointmentService.myAppointments(); 
      setAppointments(data);
    } catch (err) {
      console.error("Error loading appointments", err);
    }
    setLoading(false);
  };

  const cancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    await appointmentService.cancel(id);
    load();
  };

  const proposeFee = async (id) => {
    const amount = prompt("Enter your proposed fee:");

    if (!amount || isNaN(amount)) return alert("Invalid fee amount");

    try {
      await appointmentService.proposeFee(id, Number(amount));
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Error proposing fee");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-center min-h-[68.8vh] mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6 gap-1">
        <h1 className="text-3xl font-bold">My Appointments</h1>
      </div>

      {appointments.length === 0 ? (
        <p className="text-gray-500">You have no appointments. Browse doctors to book.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const isUpcoming = ["pending", "confirmed"].includes(appt.status);
            const proposal = appt.patientProposedFee;

            return (
              <div
                key={appt._id}
                className="border p-5 rounded-lg bg-white shadow-sm flex flex-col gap-3"
              >
                {/* Doctor & Time */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">
                      {appt.doctor?.username}
                    </p>
                    <p className="text-gray-600">
                      {new Date(appt.date).toDateString()} <br />
                      {new Date(appt.date).toTimeString().slice(0, 5)}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      isUpcoming
                        ? "bg-blue-100 text-blue-700"
                        : appt.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* ---- Fee Block ---- */}
                <div className="border-t pt-3">
                  <p className="font-medium text-gray-800">
                    Fee: KE{appt.fee}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Source: {appt?.feeSource?.replaceAll("_", " ")}
                  </p>

                  {/* Warn if global default */}
                  {appt?.feeSource === "global_default" && (
                    <p className="text-yellow-600 text-sm mt-1">
                      ⚠ This is a base charge. Actual final cost may vary depending
                      on hospital/admin review.
                    </p>
                  )}

                  {/* Fee proposal handling */}
                  {proposal && (
                    <p className="text-sm mt-2">
                      Your proposal:{" "}
                      <span className="font-semibold">KE{proposal.amount}</span>{" "}
                      <span
                        className={
                          proposal.status === "approved"
                            ? "text-green-600"
                            : proposal.status === "rejected"
                            ? "text-red-600"
                            : "text-blue-600"
                        }
                      >
                        ({proposal.status})
                      </span>
                    </p>
                  )}

                  {/* Proposal rejected notice */}
                  {proposal?.status === "rejected" && (
                    <p className="text-red-500 text-sm">
                      Your proposed fee was rejected. Standard fee applies.
                    </p>
                  )}

                  {/* Patient can propose fee if specialty allows and no result yet */}
                  {proposal &&
                    isUpcoming &&
                    appt.feeSource !== "doctor_fee" && (
                      <button
                        onClick={() => proposeFee(appt._id)}
                        className="mt-2 text-blue-600 underline text-sm"
                      >
                        Propose a different fee
                      </button>
                    )}
                </div>

                {/* ---- Review Section ---- */}
                {appt.status === "completed" && (
                  <div>
                    <p className="font-medium text-gray-800 pt-3 pb-6">Review</p>
                    
                    {!appt.reviewed ? (
                      <ReviewForm
                        appointmentId={appt._id}
                        onSuccess={() => load()}
                      />
                    ) : (
                      <p className="text-green-600">Reviewed ✓</p>
                    )}
                  </div>
                )}

                {/* ---- Cancel Appointment ---- */}
                {isUpcoming && (
                  <button
                    onClick={() => cancel(appt._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-fit"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} // Include fee / paid ammount & Arrears if any

// Patient Dashboard: My Appointments
// Route:

// /me/appointments

// Requirements:

// Patient sees upcoming, past, and canceled appointments

// Patient can cancel an upcoming appointment

// Displays doctor info & time in a nice clean UI


// Inside each completed appointment, add:

// {appt.status === "completed" && (
//   <div className="mt-3">
//     {!appt.reviewed ? (
//       <ReviewForm
//         appointmentId={appt._id}
//         onSuccess={() => load()}
//       />
//     ) : (
//       <p className="text-green-600">Reviewed ✓</p>
//     )}
//   </div>
// )}


// Note: Backend can easily mark appointments with a reviewed: true by checking review existence.