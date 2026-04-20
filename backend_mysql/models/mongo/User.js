const { mongoose } = require("../../config/mongo");

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["seeker", "employer", "admin"],
      default: "seeker",
    },
    phone: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    language: { type: String, default: "en" },
    bio: { type: String, default: null },
    skills: { type: String, default: null },
    profile_image: { type: String, default: null },
    terms_accepted: { type: Boolean, default: false },
    terms_accepted_at: { type: Date, default: null },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "users" },
);

UserSchema.pre("save", function updateTimestamp(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
