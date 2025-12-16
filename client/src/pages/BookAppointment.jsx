// src/pages/BookAppointment.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import doctorService from "../services/doctorService";
import availabilityService from "../services/availabilityService";
import appointmentService from "../services/appointmentService";
import PayButton from "../components/payment/PayButton";

export default function BookAppointment() {
  const { id: doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [appointment, setAppointment] = useState(null);

  // Doctor fee and specialty fee policy
  const [doctorFee, setDoctorFee] = useState(0);
  const [policy, setPolicy] = useState(null);

  // if patient can propose fee
  const [proposedFee, setProposedFee] = useState("");

  const load = async () => {
    setAppointment({_id: "69335290e5a7cfa204d1f418", fee: 1});
    try {
      const d = await doctorService.getById(doctorId);
      setDoctor(d);
  
      const df = await doctorService.getMyFee(doctorId);
      setDoctorFee(df.fee);
      setPolicy(df.policy);

      const av = await availabilityService.getByDoctor(doctorId);
      setAvailability(av);
    } catch (error) {
      console.error("[BOOK APPOINTMENT ERROR]: ", error)
    }
  };

  useEffect(() => {
    load();
  }, [doctorId]);

  const onSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    const day = availability.find(
      (x) => x.date.slice(0, 10) === dateStr
    );

    setSlots(day ? day.slots : []);
    setSelectedSlot("");
  };

  const book = async () => {
    if (!selectedSlot) return alert("Select a time slot");

    const payload = {
      doctorId,
      date: selectedDate,
      time: selectedSlot,
    };

    // only send proposed fee if patient can input
    if (policy?.allowPatientInputFee && proposedFee) {
      payload.proposedFee = Number(proposedFee);
    }

    try {
      const data = await appointmentService.book(payload);
      setAppointment(data);

      alert(
        policy?.allowPatientInputFee && proposedFee
          ? "Appointment booked. Fee proposal sent for review."
          : "Appointment booked!"
      );
    } catch (err) {
      alert("Could not book appointment: " + err.message);
    }
  };

  if (!doctor) return <div className="p-10">Loading...</div>;

  const finalFeeText = () => {
    // No policy at all → fallback to global default (KES 500)
    if (!policy) {
      return (
        <>
          <p className="text-gray-700">No specialty policy exists.</p>
          <p className="font-medium">
            A fallback system fee of <b>KES 500</b> will be applied at booking.
          </p>

        <p className="text-xs text-orange-600 mt-2">
          This fee may change in the future once a specialty policy is created.
        </p>
        </>
      );
    }

    // Doctor has a fixed fee (even if null later)
    if (doctorFee !== null) {
      const clamped = Math.min(Math.max(doctorFee, policy.min), policy.max);

      return (
        <>
          <p>Doctor Set Fee: <b>KES {doctorFee}</b></p>
          {clamped !== doctorFee && (
            <p className="text-xs text-red-600 mt-1">
              Adjusted to comply with specialty policy limits.
            </p>
          )}

          <p className="font-medium mt-2">
            Final Fee Charged: <b>KES {clamped}</b>
          </p>

          <p className="text-xs text-gray-500 mt-2">
            This fee is fixed and cannot be negotiated.
          </p>
        </>
      );
    }

    // Doctor did NOT set a fee → patient may propose *if allowed*
    if (policy.allowPatientInputFee) {
      return (
        <>
          <label className="block text-sm mb-1 font-semibold">
            Enter Proposed Fee (Optional)
          </label>

          <p>Allowed Fee Range: <b>{policy.min} – {policy.max}</b></p>

          <input
            type="number"
            className="border p-2 w-full mt-2"
            placeholder={`Enter amount (${policy.min}–${policy.max})`}
            value={proposedFee}
            onChange={(e) => setProposedFee(e.target.value)}
          />

          <p className="text-xs text-orange-600 mt-2">
            Your proposed fee must be approved by the doctor.
            <br />
            Booking will proceed, but the fee is <b>not final</b> until approval.
          </p>
        </>
      );
    }

    // Patient cannot propose fee → use policy default
    return (
      <>
        <p>Specialty Standard Fee: <b>KES {policy.defaultFee}</b></p>

        <p className="text-xs text-gray-500 mt-2">
          This specialty enforces a default fee. No negotiation allowed.
        </p>
      </>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10 min-h-[68.8vh]">
      {/* Doctor Header */}
      <div className="bg-white p-6 rounded shadow flex gap-4 items-center">
        <img
          src={
            doctor.picture
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${doctor.picture}`
              : "/default-doctor.jpg"
          }
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{doctor.username}</h1>
          <p className="text-gray-600">{doctor.specialty?.name}</p>

          <Link
            to={`/doctor/${doctorId}`}
            className="underline text-blue-600 text-sm"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* Select Date */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Select Date</h2>

        <>
          {availability.length === 0 ? (
            <p className="text-gray-600">No availability set.</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availability.map((a) => {
                const dateStr = a.date.slice(0, 10);
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={a._id}
                    onClick={() => onSelectDate(dateStr)}
                    className={`p-3 rounded border ${
                      isSelected ? "bg-blue-600 text-white" : "bg-gray-100"
                    }`}
                  >
                    {new Date(a.date).toDateString()}
                  </button>
                );
              })}
            </div>
          )}
        </>
      </div>

      {/* Select Slot */}
      {selectedDate && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            Select Time Slot for {new Date(selectedDate).toDateString()}
          </h2>

          {slots.length === 0 ? (
            <p className="text-gray-600">No slots available.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 border rounded ${
                    selectedSlot === slot
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fee Section */}
      {selectedSlot && !appointment && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Appointment Fee</h2>
          {finalFeeText()}
        </div>
      )}

      {/* Booking Button */}
      {selectedSlot && !appointment && (
        <button
          onClick={book}
          className="bg-green-600 text-white w-full py-3 rounded text-lg"
        >
          Confirm Booking
        </button>
      )}

      {/* After booking */}
      {appointment && (
        <div className="bg-green-50 p-4 rounded border border-green-200 mt-4">
          <h3 className="text-lg font-bold text-green-700">
            Appointment Created
          </h3>

          <p className="mt-2 text-gray-700">
            • Final fee will be displayed after doctor reviews any proposed fee.
          </p>

          <p className="mt-1 text-gray-700">
            • Check "My Appointments" to follow approval status.
          </p>
        </div>
      )}

      {/* After booking: payment */}
      {appointment && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>

          <p>
            <b>Total Fee:</b>{" "}
            <span className="text-blue-700 font-bold">
              KES {appointment?.fee}
            </span>
          </p>

          <p className="text-sm text-gray-500">
            Fee Source: <b>{appointment?.feeSource}</b>
          </p>

          {appointment?.feeSource === "patient_fee" && (
            <p className="text-orange-600 text-sm">
              Your proposed fee is pending doctor approval. Payment will only be
              final after approval.
            </p>
          )}

          <div className="flex flex-wrap gap-4 pt-3">
            {["Mpesa", "PayPal", "Card"].map((method) => (
              <div
                key={method}
                className="border p-3 rounded shadow-sm hover:bg-gray-50"
              >
                <h4 className="text-base font-semibold mb-2">{method}</h4>

                {appointment?.payment?.status !== "paid" && (
                  <PayButton appointment={appointment} method={method} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
