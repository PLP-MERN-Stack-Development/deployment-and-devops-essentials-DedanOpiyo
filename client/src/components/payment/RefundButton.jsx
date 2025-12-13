// src/components/payment/RefundButton.jsx
import refundService from "../../services/refundService";

export default function RefundButton({ payment }) {
  const refund = async () => {
    const reason = prompt("Enter refund reason:");

    if (!reason) return;

    try {
      await refundService.initiate(payment._id, reason);
      alert("Refund initiated. You will receive updates shortly.");
    } catch (err) {
      console.error(err);
      alert("Refund initiation failed");
    }
  };

  return (
    <button
      className="bg-red-600 text-white px-3 py-2 rounded"
      onClick={refund}
    >
      Issue Refund
    </button>
  );
}

// Use like:
// {user.role === "admin" && payment.status === "paid" && (
//   <RefundButton payment={payment} />
// )}


// Refund Status Component (Optional)
// <p className="text-sm">
//   Refund Status:
//   <span className="font-bold">
//     {payment.refundRequested ? payment.refundStatus : "No refund"}
//   </span>
// </p>

// Notifications Automatically Inform Patient
// Already handled in backend.
