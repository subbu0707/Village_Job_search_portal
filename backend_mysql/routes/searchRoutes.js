// Sample backend routes for additional endpoints
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { authorizeRole } = require('../middlewares/role');
const userController = require('../controllers/userController');

// Get all users (admin only)
router.get('/all', authenticate, authorizeRole('admin'), userController.getAllUsers);

// Get user by ID
router.get('/:userId', authenticate, userController.getUserById);

// Get current user profile
router.get('/profile/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Update user profile
router.put('/:userId', authenticate, userController.updateUser);

// Delete user (admin or self)
router.delete('/:userId', authenticate, userController.deleteUser);

// Search users
router.get('/search', authenticate, userController.searchUsers);

module.exports = router;
