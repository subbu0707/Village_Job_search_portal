const { mongoose } = require("../../config/mongo");

const NotificationSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    related_id: { type: Number, default: null },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "notifications" },
);

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
