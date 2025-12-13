// src/pages/help/HelpHome.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import helpService from "../../services/helpService";

export default function HelpHome() {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    helpService.getParts().then(setParts);
  }, []);

  return (
    <div className="min-h-[68.8vh]">
      <h1 className="text-3xl font-bold mb-4">Help Center</h1>

      <p className="mb-6 text-gray-700">
        Need assistance? Select a topic or report an issue.
      </p>

      <div className="space-y-3">
        {parts.map((p) => (
          <Link
            key={p._id}
            to={`/help/part/${p.slug}`}
            className="block bg-blue-50 p-4 border rounded hover:bg-blue-100"
          >
            {p.name}
          </Link>
        ))}
      </div>

      <Link
        to="/help/report"
        className="block mt-8 bg-green-600 text-white p-3 rounded w-fit"
      >
        Report an Issue
      </Link>
    </div>
  );
}
