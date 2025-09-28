const db = require("../config/db");

// Create a new notification
exports.createNotification = (req, res) => {
  const { userId, message } = req.body;
  const sql = `
    INSERT INTO notifications (userId, message, isRead)
    VALUES (?, ?, 0)
  `;
  db.query(sql, [userId, message], (err, result) => {
    if (err) return res.status(500).json({ message: "Error creating notification", error: err });
    res.json({ success: true, message: "Notification created", notificationId: result.insertId });
  });
};

// Get all notifications for a user
exports.getNotifications = (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT * FROM notifications
    WHERE userId = ?
    ORDER BY createdAt DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching notifications", error: err });
    res.json(results);
  });
};

// Mark notification as read
exports.markAsRead = (req, res) => {
  const { notificationId } = req.params;
  const sql = "UPDATE notifications SET isRead = 1 WHERE id = ?";
  db.query(sql, [notificationId], (err) => {
    if (err) return res.status(500).json({ message: "Error marking notification as read", error: err });
    res.json({ success: true, message: "Notification marked as read" });
  });
};
