const Message = require("../models/mongo/Message");
const User = require("../models/mongo/User");

// Send a message
exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = Number(req.user.id);
    const { receiverId, message, jobId } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and message are required",
      });
    }

    const created = await Message.create({
      sender_id: senderId,
      receiver_id: Number(receiverId),
      message,
      job_id: jobId ? Number(jobId) : null,
      created_at: new Date(),
      is_read: false,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        id: String(created._id),
        senderId,
        receiverId: Number(receiverId),
        message,
        jobId,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const otherUserId = Number(req.params.otherUserId);

    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: userId },
      ],
    })
      .sort({ created_at: 1 })
      .lean();

    const users = await User.find(
      { id: { $in: [userId, otherUserId] } },
      { _id: 0, id: 1, name: 1, email: 1 },
    ).lean();
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Mark messages as read
    await Message.updateMany(
      { receiver_id: userId, sender_id: otherUserId, is_read: false },
      { $set: { is_read: true } },
    );

    // Map DB fields (snake_case) to camelCase and add isOwn flag for frontend convenience
    const mapped = messages.map((m) => ({
      id: String(m._id),
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      message: m.message,
      jobId: m.job_id,
      isRead: !!m.is_read,
      createdAt: m.created_at,
      senderName: userMap.get(Number(m.sender_id))?.name || null,
      receiverName: userMap.get(Number(m.receiver_id))?.name || null,
      isOwn: m.sender_id === userId,
    }));

    res.json({
      success: true,
      data: mapped,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all conversations for a user
exports.getAllConversations = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const messages = await Message.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    })
      .sort({ created_at: -1 })
      .lean();

    const uniqueOtherIds = [];
    const seen = new Set();
    for (const msg of messages) {
      const otherUserId =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      if (!seen.has(otherUserId)) {
        seen.add(otherUserId);
        uniqueOtherIds.push(otherUserId);
      }
    }

    const users = await User.find(
      { id: { $in: uniqueOtherIds } },
      { _id: 0, id: 1, name: 1, email: 1 },
    ).lean();
    const userMap = new Map(users.map((u) => [u.id, u]));

    const conversations = uniqueOtherIds.map((otherUserId) => ({
      otherUserId,
      otherUserName: userMap.get(Number(otherUserId))?.name || "Unknown User",
      otherUserEmail: userMap.get(Number(otherUserId))?.email || null,
    }));

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const count = await Message.countDocuments({
      receiver_id: userId,
      is_read: false,
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = exports;
