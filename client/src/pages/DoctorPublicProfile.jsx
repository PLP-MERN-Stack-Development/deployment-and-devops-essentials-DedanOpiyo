// src/pages/DoctorPublicProfile.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import doctorService from "../services/doctorService";
import experienceService from "../services/experienceService";
import hospitalService from "../services/hospitalService";
import reviewService from "../services/reviewService";

import MapView from "../components/map/MapView";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DoctorPublicProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [experience, setExperience] = useState([]);
  const [currentHospital, setCurrentHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const data = await doctorService.getById(id);
        setDoctor(data);

      // current hospital (if defined)
      if (data.currentHospital) {
        const h = await hospitalService.getById(data.currentHospital);
        setCurrentHospital(h);
      }

      } catch (err) {
        console.error("Failed to load doctor", err);
      }
      setLoading(false);
    };

    loadDoctor();
  }, [id]);

  useEffect(() => {
    const loadExperienceDetail = async () => {
      try {
        // load experience
        const exp = await experienceService.getDoctorExperience(id);
        setExperience(exp);
      } catch (err) {
        console.error("Failed to experience and or current hospital details", err);
      }
      setLoading(false);
    };

    loadExperienceDetail();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await reviewService.getDoctorReviews(id);
      setReviews(data.reviews);
      setAvgRating(data.avgRating);
    };
    loadReviews();
  }, [id]);

  if (loading) return <p className="text-center min-h-[68.8vh] mt-10">Loading...</p>;
  if (!doctor) return <p className="text-center mt-10">Doctor not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 min-h-[68.8vh]">
      {/* HEADER */}
      <div className="bg-white p-6 rounded shadow flex gap-6">
        <img
          src={
            doctor.picture
              ? `${API_BASE_URL}/uploads/${doctor.picture}`
              : "/default-doctor.jpg"
          }
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{doctor.username}</h1>

          <p className="text-gray-600 text-lg mt-2">
            {doctor.specialty?.name || "General Doctor"}
          </p>
          
          {currentHospital && (
            <p className="mt-2 text-gray-700">
              <span className="font-semibold">Currently at:</span>{" "}
              {currentHospital.name}
            </p>
          )}

          <Link
            to={`/book-appointment/${id}`}
            className="inline-block bg-blue-600 mt-4 text-white px-6 py-2 rounded"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {/* BIO */}
      {doctor.bio && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">About</h2>
          <p className="text-gray-700">{doctor?.bio}</p>
        </div>
      )}

      {/* CURRENT HOSPITAL MAP */}
      {currentHospital && currentHospital.location && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-3">Hospital Location</h2>
          <MapView
            latitude={currentHospital.location.latitude}
            longitude={currentHospital.location.longitude}
            height="350px"
          />
        </div>
      )}

      {/* EXPERIENCE */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Work Experience</h2>

        <div className="space-y-4">
          {experience.map((exp) => (
            <div
              key={exp._id}
              className="border-b pb-3 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-lg">{exp.title}</p>
                <p className="text-gray-600">{exp.hospital?.name}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(exp.from).toDateString()} –{" "}
                  {exp.to ? new Date(exp.to).toDateString() : "Present"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Patient Reviews</h2>

        {avgRating > 0 && (
          <h3 className="text-base font-semibold mt-0 mb-3">
            Average Rating ({avgRating.toFixed(1)} ★)
          </h3>
        )}

        {reviews.length === 0 && (
          <p className="text-gray-600">No reviews yet.</p>
        )}

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="border p-3 rounded">
              <p className="font-semibold">
                ⭐ {rev.rating}/5
              </p>
              <p className="text-yellow-600">{rev.rating} ★</p>
              <p className="text-gray-700 mt-1">{rev.comment}</p>
              <p className="text-gray-500 text-sm mt-1">
                — {rev.patient?.username}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(rev.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// URL example:
// /doctor/:id

// This page displays:

// Doctor information

// Specialty

// Bio

// Photo

// Ratings (optional zone)

// Availability calendar grid


// Display under doctor info:

// <h2 className="text-xl font-semibold mt-10 mb-2">
//   Reviews ({avgRating.toFixed(1)} ★)
// </h2>

// {reviews.length === 0 ? (
//   <p className="text-gray-500">No reviews yet.</p>
// ) : (
//   <div className="space-y-4">
//     {reviews.map((rev) => (
//       <div key={rev._id} className="border p-4 rounded">
//         <p className="font-semibold">{rev.patient.name}</p>
//         <p className="text-yellow-600">{rev.rating} ★</p>
//         <p className="text-gray-700 mt-1">{rev.comment}</p>
//         <p className="text-sm text-gray-400">
//           {new Date(rev.createdAt).toLocaleDateString()}
//         </p>
//       </div>
//     ))}
//   </div>
// )}

// The page remains public.
// Booking logic stays because backend limits booking to patients only.
