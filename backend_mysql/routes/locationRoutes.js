// backend_mysql/routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Get all unique states from jobs
router.get('/states', locationController.getStates);

// Get cities for a specific state
router.get('/cities', locationController.getCities);

// Get villages/areas for a specific city
router.get('/villages', locationController.getVillages);

// Get coordinates for all locations
router.get('/coordinates', locationController.getCoordinates);

// Get coordinates for a specific location
router.get('/location-coordinates', locationController.getLocationCoordinates);

// Get job count by location
router.get('/job-count', locationController.getJobCountByLocation);

module.exports = router;
