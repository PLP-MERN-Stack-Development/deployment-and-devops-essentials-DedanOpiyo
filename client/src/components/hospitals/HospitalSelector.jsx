// src/hospitals/HospitalSelector.jsx
import { useState } from "react";
import HospitalSearch from "./HospitalSearch";
import OSMLocationPicker from "../map/LocationPicker";
import hospitalService from "../../services/hospitalService";
import { useReportKnownIssue } from "../../utils/reportKnownIssue";
import useAuth from "../../hooks/useAuth";

export default function HospitalSelector({ value, onChange }) {
  const reportKnownIssue = useReportKnownIssue();   // -- HOOK
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  const createFromMap = async (place) => {
    try {
      if (user.role !== "admin") {
        reportKnownIssue({
          code: "ADMIN_ONLY_HOSPITAL_CREATION",
          data: {
            attemptedHospital: place.name,
            coordinates: [place.latitude, place.longitude]
          }
        });
        return;  // STOP early, no backend work
      }

      setCreating(true);

      const payload = {
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude
      };

      const created = await hospitalService.create(payload);
      onChange(created._id);
    } catch (err) {
      alert("Failed to create hospital from map");
      // Generic unexpected error
      reportKnownIssue({
        message: "Unexpected error while creating hospital", // Optional
        data: { error: err.message }
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold">Select or Create Hospital</h3>

      {/* SEARCH MODE */}
      <HospitalSearch
        onSelect={(h) => onChange(h._id)}
      />

      <div className="text-center text-gray-500">or</div>

      {/* MAP MODE */}
      <OSMLocationPicker
        onSelect={createFromMap}
      />

      {value && (
        <p className="text-sm text-green-700">
          Selected Hospital ID: {value}
        </p>
      )}

      {creating && (
        <p className="text-blue-600 text-sm">Creating hospital…</p>
      )}
    </div>
  );
}

// HospitalSelector: Integrate help context correctly
// Why this is perfect

// Fast exit for known restrictions

// Detailed context automatically captured

// Guaranteed no missing data

// Helps admin track exact user intention


// This's a sample component testing both known and unknown erroes with respect to help