// src/components/ReviewForm.jsx
import { useState } from "react";
import reviewService from "../services/reviewService";

export default function ReviewForm({ appointmentId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await reviewService.add({
        appointmentId,
        rating,
        comment,
      });

      setMsg("Review submitted!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setMsg("Error submitting review.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 mt-3 border p-4 rounded">
      <div>
        <label className="block font-semibold mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded w-full"
        >
          {[5,4,3,2,1].map(n => (
            <option key={n} value={n}>{n} ★</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Comment</label>
        <textarea
          className="border p-2 rounded w-full"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {msg && <p className="text-green-700">{msg}</p>}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        type="submit"
      >
        Submit Review
      </button>
    </form>
  );
}

// Patient → Write Review Page Component

// Where this appears:

// MyAppointments.jsx
// ➡ In the list, for each appointment with status "completed"
// ➡ If already reviewed: display "Reviewed"
// ➡ If not: show a “Write Review” button → modal or inline form

// Below is the review form component:
