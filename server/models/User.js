// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    // Doctor-only fields
    specialty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
      default: null,
    },

    currentHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null
    },

    fee: { 
      type: Number,
      min: 0,
      default: null   // null = unconfigured
    },

    bio: { type: String },
    picture: { type: String },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);


// Now doctors have:

// specialty

// bio

// picture

// currentHospital

// historic work experience in separate table


// Admin Fee Policy System caps min/max fee (models/FeePolicy.js)
// models/Appointment.js also has fee field (determining final charge at moment of booking)
// Users / patients may be allowed to include / enter their fee (but caped) at point of booking
