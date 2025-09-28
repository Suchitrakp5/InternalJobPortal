const db = require("../config/db");
const bcrypt = require("bcryptjs");

// 🔹 Login
const login = (req, res, next) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error checking password" });
      }

      if (!isMatch) {
        return res.json({ success: false, message: "Invalid credentials" });
      }

      res.json({ success: true, role: user.role });
    });
  });
};

// 🔹 Register
const register = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Check if email already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password before inserting
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error hashing password" });
      }

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: "Error registering user" });
          }
          res.json({ success: true, message: "User registered successfully" });
        }
      );
    });
  });
};

// 🔹 Forgot Password
const forgotPassword = (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email and new password are required" });
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error hashing password" });
    }

    db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "Password updated successfully!" });
    });
  });
};

module.exports = { login, register, forgotPassword };
