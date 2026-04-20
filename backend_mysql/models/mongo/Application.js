const { mongoose } = require("../../config/mongo");

const ApplicationSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    job_id: { type: Number, required: true, index: true },
    user_id: { type: Number, required: true, index: true },
    status: {
      type: String,
      enum: [
        "pending",
        "shortlisted",
        "accepted",
        "rejected",
        "withdrawn",
        "completed",
      ],
      default: "pending",
    },
    applied_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    isRated: { type: Number, default: 0 },
  },
  { collection: "applications" },
);

ApplicationSchema.index({ job_id: 1, user_id: 1 }, { unique: true });

ApplicationSchema.pre("save", function updateTimestamp(next) {
  this.updated_at = new Date();
  next();
});

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
