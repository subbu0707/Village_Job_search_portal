const { mongoose } = require("../../config/mongo");

const JobSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    employer_id: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    jobType: { type: String, default: "Full-time" },
    salary_min: { type: Number, default: null },
    salary_max: { type: Number, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    village: { type: String, default: null },
    category: { type: String, default: "General" },
    requirements: { type: String, default: null },
    womenOnly: { type: Number, default: 0 },
    is_active: { type: Number, default: 1, index: true },
    isActive: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "jobs" },
);

JobSchema.pre("save", function updateTimestamp(next) {
  this.updated_at = new Date();
  this.isActive = this.is_active;
  next();
});

module.exports = mongoose.models.Job || mongoose.model("Job", JobSchema);
