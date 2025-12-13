// models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate slug
CategorySchema.pre("save", function () {
  if (!this.isModified("name")) return;

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/--+/g, "-")
    .trim();
});

module.exports = mongoose.model('Category', CategorySchema);


// 1. Recommended MediReach Blog Categories

// (Optimized for doctor-authored content, SEO, and audience needs)

// ## Core Medical Categories

// Skin & Dermatology

// Women’s Health

// Men’s Health

// Children’s Health

// Mental Health & Wellness

// Chronic Illness

// Infectious Diseases

// Allergies & Immune Health

// Nutrition & Healthy Eating

// Fitness & Physical Therapy

// Reproductive & Sexual Health

// Dental & Oral Health

// Heart Health (Cardiology)

// Lung & Respiratory Health

// Digestive Health (Gastroenterology)

// Hormones & Endocrine Disorders

// Eye Care (Ophthalmology)

// Ear, Nose & Throat (ENT)

// Medications & Treatments

// Surgery, Procedures & Diagnostics

// ## Lifestyle + Preventive Care

// Healthy Living Tips

// Weight Management

// Stress Management

// Sleep & Recovery

// Self-Care & Home Remedies

// Elderly & Long-Term Care

// Workplace Health

// Student Health

// ## Local & Regional Health

// Kenya Healthcare Updates

// Hospital Spotlight

// Community Health & Outreach

// ## Technology & MediReach

// Telemedicine

// Medical Technology

// Patient Education