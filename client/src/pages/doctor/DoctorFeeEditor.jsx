// src/pages/doctor/DoctorFeeEditor.jsx
import { useEffect, useState } from "react";
import doctorService from "../../services/doctorService";

export default function DoctorFeeEditor() {
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await doctorService.getMyFee();
        setFee(data.fee || "");
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveFee = async (e) => {
    e.preventDefault();

    if (!fee || isNaN(fee) || Number(fee) < 0) {
      return alert("Enter a valid fee");
    }

    await doctorService.updateFee({ fee: Number(fee) });
    alert("Fee updated!");
  };

  if (loading) return "Loading...";

  return (
    <div className="max-w-xl mx-auto min-h-[68.8vh] space-y-5">
      <h1 className="text-2xl font-bold">Set Consultation Fee</h1>

      <form onSubmit={saveFee} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Consultation Fee (KES)</span>
          <input
            type="number"
            min="0"
            className="border p-3 w-full mt-1"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Fee
        </button>
      </form>
    </div>
  );
}
