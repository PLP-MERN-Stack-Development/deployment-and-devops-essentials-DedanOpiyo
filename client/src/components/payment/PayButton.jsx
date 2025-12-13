// src/components/payment/PayButton.jsx
import { useState } from "react";
import paymentService from "../../services/paymentService";

export default function PayButton({ appointment, method }) {
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);

    try {
      if (method === "Mpesa") {
        // 👉 Mpesa-specific flow
        const phone = prompt("Enter your M-PESA phone number (2547XXXXXXXX):");
        if (!phone) {
          setLoading(false);
          return;
        }

        // (Optional) Validate phone
        // (Optional) Inform if it's not user's registered phone

        await paymentService.initiateMpesa({
          appointmentId: appointment._id,
          phone,
          amount: appointment?.fee || 500,
        });

        alert("Mpesa STK push sent! Enter PIN on your phone.");
      }

      else if (method === "PayPal") {
        // 👉 PayPal redirect or popup
        const url = await paymentService.initiatePayPal({
          appointmentId: appointment._id,
          amount: appointment.fee || 500,
        });

        window.location.href = url;
      }

      else {
        alert("Payment method not supported yet.");
      }

    } catch (err) {
      alert("Payment failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={pay}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow"
    >
      {loading ? "Processing..." : `Pay with ${method}`}
    </button>
  );
}

// Use: Payment Button (Appointment Page) - BookAppointment.jsx or wherever appropriate: pre / post payment