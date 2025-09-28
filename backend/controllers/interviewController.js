const db = require("../config/db");

// Schedule an interview
exports.scheduleInterview = (req, res) => {
  const { applicationId, interviewer, date, time, mode } = req.body;
  const sql = `
    INSERT INTO interviews (applicationId, interviewer, date, time, mode)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [applicationId, interviewer, date, time, mode], (err, result) => {
    if (err) return res.status(500).json({ message: "Error scheduling interview", error: err });
    res.json({ success: true, message: "Interview scheduled successfully", interviewId: result.insertId });
  });
};

// Get all upcoming interviews
exports.getInterviews = (req, res) => {
  const sql = `
    SELECT i.id, i.date, i.time, i.mode, i.interviewer,
           a.userId, u.name, u.email, j.title AS jobTitle
    FROM interviews i
    JOIN applications a ON i.applicationId = a.id
    JOIN users u ON a.userId = u.id
    JOIN job_postings j ON a.jobId = j.id
    WHERE i.date >= CURDATE()
    ORDER BY i.date ASC, i.time ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching interviews", error: err });
    res.json(results);
  });
};
