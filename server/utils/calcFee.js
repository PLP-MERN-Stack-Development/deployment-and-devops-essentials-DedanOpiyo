// utils/calcFee.js
const FeePolicy = require("../models/FeePolicy");
const User = require("../models/User");

exports.calculateFee = async ({ doctorId, patientProposedFee }) => {
  const doctor = await User.findById(doctorId).populate("specialty");
  const policy = await FeePolicy.findOne({ specialty: doctor.specialty });

  // === CASE 1 — doctor has manual fee ===
  if (doctor.fee !== null && doctor.fee !== undefined) {
    if (policy) {
      // clamp within boundaries
      const clamped = Math.min(Math.max(doctor.fee, policy.min), policy.max);
      
      return {
        fee: clamped,
        feeSource:
          clamped !== doctor.fee
            ? "specialty_policy_doctor_fee_clamped" // if clamped changed value 
            : "doctor_fee",                         // if clamped din't changed value 
      };
    }

    // no policy → dangerous pricing situation
    return {
      fee: doctor.fee,
      feeSource: "no_policy_used_default"
    };
  }

  // === CASE 2 — doctor has no fee ===
  if (policy) {
    return {
      fee: policy.defaultFee,
      feeSource: "specialty_default"
    };
  }

  // === CASE 4 — no policy and no doctor fee → global fallback ===
  return {
    fee: 500, // global default
    feeSource: "global_default"
  };
};
