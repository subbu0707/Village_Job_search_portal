// backend_mysql/controllers/notificationController.js
const Notification = require("../models/mongo/Notification");

// Create notification
exports.createNotification = async (req, res, next) => {
  try {
    const { user_id, type, title, message, related_id } = req.body;

    if (!user_id || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "User ID, type, title, and message are required",
      });
    }

    const created = await Notification.create({
      user_id: Number(user_id),
      type,
      title,
      message,
      related_id: related_id ? Number(related_id) : null,
      is_read: false,
      created_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Notification created",
      data: { id: String(created._id) },
    });
  } catch (error) {
    next(error);
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const notifications = await Notification.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    res.json({
      success: true,
      data: notifications,
      pagination: { page, limit },
    });
  } catch (error) {
    next(error);
  }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const count = await Notification.countDocuments({
      user_id: userId,
      is_read: false,
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    await Notification.updateOne(
      { _id: notificationId },
      { $set: { is_read: true } },
    );

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    await Notification.updateMany(
      { user_id: userId, is_read: false },
      { $set: { is_read: true } },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    await Notification.deleteOne({ _id: notificationId });

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Delete all notifications for user
exports.deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    await Notification.deleteMany({ user_id: userId });

    res.json({
      success: true,
      message: "All notifications deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
