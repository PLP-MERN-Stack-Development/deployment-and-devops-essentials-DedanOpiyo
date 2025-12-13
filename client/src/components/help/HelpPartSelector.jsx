// src/components/help/HelpPartSelector.jsx
import { useEffect, useState } from "react";
import helpService from "../../services/helpService";

export default function HelpPartSelector({ value, onChange }) {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    helpService.getParts().then(setParts);
  }, []);

  return (
    <div>
      <label className="block font-medium mb-1">Problem Area</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2 w-full"
      >
        <option value="">Select a section…</option>
        {parts.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
        <option value="other">Other (describe manually)</option>
      </select>
    </div>
  );
}
