// client/src/components/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 mb-6"
    >
      <input
        type="text"
        placeholder="Search posts..."
        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring focus:ring-blue-300"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
