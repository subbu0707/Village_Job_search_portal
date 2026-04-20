// backend_mysql/controllers/locationController.js
const Job = require("../models/mongo/Job");
const LocationCoordinate = require("../models/mongo/LocationCoordinate");

// Get all unique states from jobs
exports.getStates = async (req, res, next) => {
  try {
    const states = await Job.distinct("state", { state: { $ne: null } });
    states.sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      data: states,
    });
  } catch (error) {
    next(error);
  }
};

// Get cities for a specific state
exports.getCities = async (req, res, next) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State parameter is required",
      });
    }

    const cities = await Job.distinct("city", {
      state,
      city: { $ne: null },
    });
    cities.sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

// Get villages/areas for a specific city
exports.getVillages = async (req, res, next) => {
  try {
    const { state, city } = req.query;

    if (!state || !city) {
      return res.status(400).json({
        success: false,
        message: "State and city parameters are required",
      });
    }

    const villages = await Job.distinct("village", {
      state,
      city,
      village: { $ne: null },
    });
    villages.sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      data: villages,
    });
  } catch (error) {
    next(error);
  }
};

// Get coordinates for all locations
exports.getCoordinates = async (req, res, next) => {
  try {
    const rows = await LocationCoordinate.find(
      {},
      { _id: 0, state: 1, city: 1, latitude: 1, longitude: 1 },
    )
      .sort({ state: 1, city: 1 })
      .lean();

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// Get coordinates for a specific location
exports.getLocationCoordinates = async (req, res, next) => {
  try {
    const { state, city } = req.query;

    if (!state || !city) {
      return res.status(400).json({
        success: false,
        message: "State and city parameters are required",
      });
    }

    const row = await LocationCoordinate.findOne(
      { state, city },
      { _id: 0, latitude: 1, longitude: 1 },
    ).lean();

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Location coordinates not found",
      });
    }

    res.json({
      success: true,
      data: row,
    });
  } catch (error) {
    next(error);
  }
};

// Get job count by location
exports.getJobCountByLocation = async (req, res, next) => {
  try {
    const rows = await Job.aggregate([
      { $match: { is_active: 1 } },
      {
        $group: {
          _id: { state: "$state", city: "$city" },
          job_count: { $sum: 1 },
        },
      },
      { $sort: { job_count: -1 } },
      {
        $project: {
          _id: 0,
          state: "$_id.state",
          city: "$_id.city",
          job_count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
