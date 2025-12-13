// src/components/hospitals/HospitalSearch.jsx
import { useState } from "react";
import hospitalService from "../../services/hospitalService";

export default function HospitalSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async (value) => {
    setQuery(value);

    if (!value) return setResults([]);

    const res = await hospitalService.search(value);
    setResults(res);
  };

  return (
    <div className="space-y-2 relative">
      
      <input
        className="border p-3 w-full"
        value={query}
        placeholder="Search hospital by name..."
        onChange={(e) => search(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="absolute bg-white border rounded shadow-md w-full max-h-60 overflow-auto z-50">
          {results.map((h) => (
            <li
              key={h._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(h);
                setQuery(h.name);
                setResults([]);
              }}
            >
              {h.name} — {h.location?.latitude}, {h.location?.longitude}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
