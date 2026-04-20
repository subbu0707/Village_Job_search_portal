const { mongoose } = require("../../config/mongo");

const CounterSchema = new mongoose.Schema(
  {
    collectionName: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
  },
  { collection: "counters" },
);

module.exports =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
