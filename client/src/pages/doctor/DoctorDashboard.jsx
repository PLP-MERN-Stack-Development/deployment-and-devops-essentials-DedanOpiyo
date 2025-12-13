// src/pages/doctor/DoctorDashboard.jsx
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="space-y-6 min-h-[68.8vh]">
      <h1 className="text-3xl font-bold">Doctor Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        
        <Link to="/doctor/dashboard/profile" className="bg-white shadow-md border rounded-lg p-6 hover:shadow-xl transition cursor-pointer">
          <h3>Edit Profile</h3>
          <p>Bio, specialty, picture, currentHospital</p>
        </Link>

        <Link
          to="/doctor/dashboard/fees"
          className="bg-white shadow-md border rounded-lg p-6 hover:shadow-xl transition cursor-pointer"
        >
          <h3>Consultation Fee</h3>
          <p>Set how much a patient must pay</p>
        </Link>

        <Link to="/doctor/dashboard/availability" className="bg-white shadow-md border rounded-lg p-6 hover:shadow-xl transition cursor-pointer">
          <h3>Manage Availability</h3>
          <p>Add or remove open slots</p>
        </Link>

        <Link to="/doctor/dashboard/appointments" className="bg-white shadow-md border rounded-lg p-6 hover:shadow-xl transition cursor-pointer">
          <h3>Appointments</h3>
          <p>View & complete appointments</p>
        </Link>

        <Link
          to="/doctor/dashboard/experience"
          className="bg-white shadow-md border rounded-lg p-6 hover:shadow-xl transition cursor-pointer"
        >
          <h3>Work Experience</h3>
          <p>Add or edit hospitals you've worked in</p>
        </Link>
      </div>
    </div>
  );
}

// (You can style .dashboard-card easily.)
// /* src/index.css */
// .dashboard-card {
//   @apply bg-white shadow-md border rounded-lg p-6 hover:shadow-xl transition cursor-pointer;
// }
