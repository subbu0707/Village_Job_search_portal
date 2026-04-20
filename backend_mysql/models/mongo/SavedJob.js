const { mongoose } = require("../../config/mongo");

const SavedJobSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true, index: true },
    job_id: { type: Number, required: true, index: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "saved_jobs" },
);

SavedJobSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports =
  mongoose.models.SavedJob || mongoose.model("SavedJob", SavedJobSchema);
