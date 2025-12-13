// client/src/pages/CategoryManager.jsx
import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import Card from "../components/Card";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    const data = await categoryService.getAllCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.createCategory({ name });
      alert("Category created succesfully!")
      setName("");
      loadCategories();
    } catch (err) {
      alert("Failed to create category");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto min-h-[68.8vh] mt-10">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

        <form onSubmit={createCategory} className="flex space-x-2 mb-6">
          <input
            className="flex-1 border dark-:border-gray-700 px-3 py-2 rounded bg-white dark-:bg-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New Category Name"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add
          </button>
        </form>

        <ul className="space-y-2">
          {categories.map((c) => (
            <li
              key={c._id}
              className="p-3 bg-gray-100 dark-:bg-gray-800 rounded-md"
            >
              {c.name}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
