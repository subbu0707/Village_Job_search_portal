// Message Routes
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middlewares/auth');

// Send a message
router.post('/', authenticate, messageController.sendMessage);

// Get conversations
router.get('/conversations', authenticate, messageController.getAllConversations);

// Get unread message count (must be before /:otherUserId)
router.get('/unread/count', authenticate, messageController.getUnreadCount);

// Get conversation with specific user
router.get('/:otherUserId', authenticate, messageController.getConversation);

module.exports = router;
