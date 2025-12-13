// src/pages/payment/PaymentHistory.jsx
import { useEffect, useState } from "react";
import paymentService from "../../services/paymentService";
import { Link } from "react-router-dom";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.history().then((data) => {
      setPayments(data.payments);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <p className="text-gray-600">No payments found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <Link
              key={p._id}
              to={`/me/payments/${p._id}`}
              className="block border p-4 rounded-lg shadow-sm bg-white hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">Ksh {p.amount}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 h-fit rounded text-sm ${
                    p.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : p.status === "pending"
                      ? "bg-blue-100 text-blue-700"
                      : p.status === "failed"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Route:
// /me/payments
