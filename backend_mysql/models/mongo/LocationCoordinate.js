const { mongoose } = require("../../config/mongo");

const LocationCoordinateSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { collection: "location_coordinates" },
);

LocationCoordinateSchema.index({ state: 1, city: 1 }, { unique: true });

module.exports =
  mongoose.models.LocationCoordinate ||
  mongoose.model("LocationCoordinate", LocationCoordinateSchema);
