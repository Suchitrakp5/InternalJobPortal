const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Create a new notification
router.post("/notifications", notificationController.createNotification);

// Get all notifications for a user
router.get("/notifications/:userId", notificationController.getNotifications);

// Mark notification as read
router.put("/notifications/:notificationId/read", notificationController.markAsRead);

module.exports = router;
