
// controllers/jobController.js
const db = require("../config/db");

// Create Job
exports.createJob = (req, res) => {
  const { title, department, location, skillSet, employmentType, salary, startDate, endDate } = req.body;

  const sql = `
    INSERT INTO job_postings 
    (title, department, location, skillSet, employmentType, salary, startDate, endDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, department, location, skillSet, employmentType, salary, startDate, endDate], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error creating job", error: err });
    }

    // return the inserted id so frontend can refresh or redirect if needed
    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      jobId: result.insertId
    });
  });
};


// Get All Jobs
exports.getJobs = (req, res) => {
    db.query("SELECT * FROM job_postings ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching jobs" });
        res.json(results);
    });
};

// Get Job by ID
exports.getJobById = (req, res) => {
    const jobId = req.params.id;
    db.query("SELECT * FROM job_postings WHERE id = ?", [jobId], (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching job" });
        if (results.length === 0) return res.status(404).json({ message: "Job not found" });
        res.json(results[0]);
    });
};

// Update Job
exports.updateJob = (req, res) => {
    const jobId = req.params.id;
    const { title, department, location, skillSet, employmentType, salary, startDate, endDate } = req.body;

    const sql = `
        UPDATE job_postings 
        SET title=?, department=?, location=?, skillSet=?, employmentType=?, salary=?, startDate=?, endDate=?
        WHERE id=?
    `;

    db.query(sql, [title, department, location, skillSet, employmentType, salary, startDate, endDate, jobId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating job" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Job not found" });
        res.json({ success: true, message: "Job updated successfully" });
    });
};

// Delete Job
exports.deleteJob = (req, res) => {
    const jobId = req.params.id;

    db.query("DELETE FROM job_postings WHERE id = ?", [jobId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error deleting job" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json({ success: true, message: "Job deleted successfully" });
    });
};
