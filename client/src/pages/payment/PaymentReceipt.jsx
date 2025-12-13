// src/pages/payment/PaymentReceipt.jsx
import { useEffect, useState } from "react";
import paymentService from "../../services/paymentService";
import { useParams } from "react-router-dom";

export default function PaymentReceipt() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.get(id).then((data) => {
      setPayment(data.payment);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (!payment) return <p className="text-center p-10">Payment not found.</p>;

  const printReceipt = () => window.print();

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded-lg mt-8 print:p-0">
      <h1 className="text-2xl font-bold mb-4">Payment Receipt</h1>

      <div className="border-b pb-3 mb-3">
        <p><strong>Receipt No:</strong> {payment.mpesaReceiptNumber || "—"}</p>
        <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
      </div>

      <div className="space-y-2">
        <p><strong>Patient:</strong> {payment.patient.name}</p>
        <p><strong>Phone:</strong> {payment.phone}</p>

        <p><strong>Appointment ID:</strong> {payment.appointment?._id}</p>
        <p><strong>Appointment Date:</strong> 
          {new Date(payment.appointment?.date).toDateString()}
        </p>

        <p><strong>Amount Paid:</strong> Ksh {payment.amount}</p>
        <p><strong>Status:</strong> 
          <span className="ml-2 uppercase font-semibold">{payment.status}</span>
        </p>
      </div>

      <div className="mt-6 flex justify-between print:hidden">
        <button
          onClick={printReceipt}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print Receipt
        </button>
      </div>
      
      {/* Download Invoice Button */}
      <div className="mt-6 flex justify-between print:hidden">
        <a
          href={`${import.meta.env.VITE_API_URL}/payments/${id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Invoice (PDF)
        </a>
      </div>
    </div>
  );
}

// Payment Receipt Page
// Print Receipt Styling in index.css

// Download Invoice Button automatically starts the download.
// Because we use cookies, no need to send token manually.

// PDF Preview (Optional)
// We can embed the PDF in iframe:
// <iframe
//   src={`${import.meta.env.VITE_API_URL}/payments/${id}/invoice`}
//   className="w-full h-[600px] border"
// />

// Route:
// /me/payments/:id
