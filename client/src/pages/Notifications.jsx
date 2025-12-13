// src/pages/Notifications.jsx
import { useEffect, useState } from "react";
import notificationService from "../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const load = () => {
    notificationService.getAll().then((d) => setNotifications(d.notifications));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => notificationService.markAll().then(load)}
      >
        Mark All Read
      </button>

      {notifications.map((n) => (
        <div
          key={n._id}
          className={`p-4 mb-3 border rounded shadow ${
            !n.read ? "bg-yellow-50" : "bg-white"
          }`}
        >
          <h2 className="font-bold">{n.title}</h2>
          <p>{n.message}</p>
          <p className="text-gray-400 text-sm">
            {new Date(n.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

// Add route:
// <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
