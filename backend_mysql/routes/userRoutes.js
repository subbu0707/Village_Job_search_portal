// backend_mysql/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const { authenticate } = require('../middlewares/auth');

// Protected routes (all require authentication)

// Get current user profile
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        state: user.state,
        city: user.city,
        language: user.language,
        bio: user.bio,
        skills: user.skills,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { name, phone, state, city, language, bio, skills } = req.body;

    const updatedUser = await userModel.updateProfile(req.user.id, {
      name,
      phone,
      state,
      city,
      language,
      bio,
      skills
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        state: updatedUser.state,
        city: updatedUser.city,
        language: updatedUser.language,
        bio: updatedUser.bio,
        skills: updatedUser.skills
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID (admin/employer to view seeker profile)
router.get('/:userId', authenticate, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        phone: user.phone,
        state: user.state,
        city: user.city,
        language: user.language
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get users by role (admin only)
router.get('/role/:role', authenticate, async (req, res, next) => {
  try {
    const { role } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const users = await userModel.getUsersByRole(role, limit, offset);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
