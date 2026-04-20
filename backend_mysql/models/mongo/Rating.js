const { mongoose } = require("../../config/mongo");

const RatingSchema = new mongoose.Schema(
  {
    jobId: { type: Number, required: true, index: true },
    seekerId: { type: Number, required: true, index: true },
    employerId: { type: Number, required: true, index: true },
    rating: { type: Number, required: true },
    review: { type: String, default: "" },
    punctuality: { type: Number, default: 5 },
    workQuality: { type: Number, default: 5 },
    communication: { type: Number, default: 5 },
    professionalism: { type: Number, default: 5 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "ratings" },
);

RatingSchema.index({ jobId: 1, seekerId: 1, employerId: 1 }, { unique: true });

RatingSchema.pre("save", function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

module.exports =
  mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
