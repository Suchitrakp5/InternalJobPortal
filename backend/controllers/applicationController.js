const db = require("../config/db");

exports.getApplicationsByJob = (req, res) => {
  const { jobId } = req.params;

  const sql = `
    SELECT id, jobId, name, email, phone, resume, status, appliedAt
    FROM applications
    WHERE jobId = ?
    ORDER BY appliedAt DESC
  `;

  db.query(sql, [jobId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching applications", error: err });
    res.json(results);
  });
};


// Apply for a Job (with resume upload)
exports.applyJob = (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);
  const { jobId, name, email, phone } = req.body;
  const resume = req.file ? req.file.filename : null;

  if (!name || !email || !phone || !resume) {
    return res.status(400).json({ message: "All fields are required (name, email, phone, resume)" });
  }

  const sql = `
    INSERT INTO applications (jobId, name, email, phone, resume, status, appliedAt) 
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [jobId, name, email, phone, resume, "Pending"], (err, result) => {
   if (err) {
      console.error("Database error:", err); // ✅ log the actual error
      return res.status(500).json({ message: "Error applying job", error: err });
    }
    res.status(201).json({ success: true, message: "Application submitted successfully", applicationId: result.insertId });
  });
};

// Get Applications for a specific user (by email)
exports.getUserApplications = (req, res) => {
  const { email } = req.query;
  const sql = `
    SELECT a.*, j.title 
    FROM applications a 
    JOIN job_postings j ON a.jobId = j.id
    WHERE a.email = ? 
    ORDER BY a.appliedAt DESC
  `;
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching applications" });
    res.json(results);
  });
};

// Get All Applications (HR Dashboard)
exports.getAllApplications = (req, res) => {
  const sql = `
    SELECT a.*, j.title 
    FROM applications a 
    JOIN job_postings j ON a.jobId = j.id 
    ORDER BY a.appliedAt DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching applications" });
    res.json(results);
  });
};

// Update application status
exports.updateApplicationStatus = (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  const sql = "UPDATE applications SET status = ? WHERE id = ?";
  db.query(sql, [status, applicationId], (err) => {
    if (err) return res.status(500).json({ message: "Error updating application status", error: err });
    res.json({ success: true, message: "Application status updated successfully" });
  });
};

// Delete application
exports.deleteApplication = (req, res) => {
  const { applicationId } = req.params;

  const sql = "DELETE FROM applications WHERE id = ?";
  db.query(sql, [applicationId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting application", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ success: true, message: "Application withdrawn successfully" });
  });
};
