// src/pages/help/HelpPartPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import helpService from "../../services/helpService";

export default function HelpPartPage() {
  const { slug } = useParams();
  const [part, setPart] = useState(null);

  useEffect(() => {
    helpService.getParts().then((parts) => {
      const found = parts.find((p) => p.slug === slug);
      setPart(found);
    });
  }, [slug]);

  if (!part) return <p>Loading...</p>;

  return (
    <div className="min-h-[68.8vh]">
      <h1 className="text-2xl font-bold mb-4">{part.name}</h1>
      <p className="text-gray-600 mb-6">{part.description}</p>

      <Link
        to="/help/report"
        state={{ partId: part._id }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Report an issue about this section
      </Link>
    </div>
  );
}
