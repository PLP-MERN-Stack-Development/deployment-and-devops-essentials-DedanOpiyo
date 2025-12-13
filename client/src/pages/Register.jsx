// client/src/pages/Register.jsx
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form.username, form.email, form.password, form.role);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Email may already be taken.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center  min-h-[68.8vh] bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          name="username"
          className="w-full border p-3 rounded mb-3"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          className="w-full border p-3 rounded mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Role Selection */}
        <select
          name="role"
          className="w-full border p-3 rounded mb-4"
          value={form.role}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
