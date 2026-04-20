const { mongoose } = require("../../config/mongo");

const MessageSchema = new mongoose.Schema(
  {
    sender_id: { type: Number, required: true, index: true },
    receiver_id: { type: Number, required: true, index: true },
    message: { type: String, required: true },
    job_id: { type: Number, default: null },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now, index: true },
  },
  { collection: "messages" },
);

module.exports =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
