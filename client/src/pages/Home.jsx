// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-10 mt-10">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden shadow-md">
        <img
          src="../src/assets/clinic.jpg"
          alt="Clinic"
          className="w-full h-92 sm:h-112 object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
          <h2 className="text-3xl font-bold mb-2">Welcome to MediReach</h2>
          <p className="max-w-xl">
            Book appointments, connect with verified doctors, and explore medical
            articles written by professionals.
          </p>

          <Link
            to="/doctor/directory"
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Find a Doctor
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-md shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Book Appointments</h3>
          <p>Fast, easy appointment scheduling with licensed doctors.</p>
          <Link to="/me/appointments" className="text-blue-600 underline mt-2 block">
            View Appointments
          </Link>
        </div>

        <div className="p-6 bg-white rounded-md shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Doctor Portal</h3>
          <p>Doctors can manage availability, appointments, and patient notes.</p>
          <Link to="/doctor/dashboard" className="text-blue-600 underline mt-2 block">
            Doctor Dashboard
          </Link>
        </div>

        <div className="p-6 bg-white rounded-md shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Medical Blog</h3>
          <p>View helpful medical articles and tips from professionals.</p>
          <Link to="/posts" className="text-blue-600 underline mt-2 block">
            Browse Posts
          </Link>
        </div>
      </section>
    </div>
  );
}
