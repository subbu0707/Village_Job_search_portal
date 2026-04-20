// backend_mysql/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/auth');

// Protected routes (all require authentication)
router.post('/', authenticate, notificationController.createNotification);
router.get('/', authenticate, notificationController.getUserNotifications);
router.get('/unread/count', authenticate, notificationController.getUnreadCount);
router.patch('/:notificationId/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:notificationId', authenticate, notificationController.deleteNotification);
router.delete('/all', authenticate, notificationController.deleteAllNotifications);

module.exports = router;
