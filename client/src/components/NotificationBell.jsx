// src/components/NotificationBell.jsx
import { useEffect, useState } from "react";
import notificationService from "../services/notificationService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const load = () => {
    notificationService.getAll().then((d) => setNotifications(d.notifications));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => setOpen((o) => !o)}
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow rounded p-4 z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="text-gray-500">No notifications</p>
          )}

          {notifications.map((n) => (
            <div key={n._id} className="border-b py-2">
              <p className="font-semibold">{n.title}</p>
              <p className="text-gray-600 text-sm">{n.message}</p>
              {!n.read && (
                <button
                  onClick={() => notificationService.markRead(n._id).then(load)}
                  className="text-blue-600 text-sm mt-1"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}

          {notifications.length > 0 && (
            <button
              onClick={() => notificationService.markAll().then(load)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Mark All Read
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Place this in the top navigation:
// import NotificationBell from "../components/NotificationBell";

// ...

// <div className="flex items-center gap-4">
//   <NotificationBell />
//   <UserMenu />
// </div>
