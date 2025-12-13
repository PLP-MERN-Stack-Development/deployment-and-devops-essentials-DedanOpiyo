// client/src/components/CategorySidebar.jsx
import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";

export default function CategorySidebar({ selectedCategory, onCategorySelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories);
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-6 sm:min-h-[60vh]">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>

      <button
        onClick={() => onCategorySelect(null)}
        className={`block mb-2 ${
          selectedCategory === null
            ? "text-blue-700 font-semibold underline"
            : "text-blue-600 hover:underline"
        }`}
      >
        All Posts
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onCategorySelect(cat._id)}
          className={`block mb-2 ${
            selectedCategory === cat._id
              ? "text-blue-700 font-semibold underline"
              : "text-gray-700 hover:text-blue-600 hover:underline"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
