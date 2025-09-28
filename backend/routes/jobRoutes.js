const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Create a new job posting
router.post("/jobs", jobController.createJob);

// Get all jobs
router.get("/jobs", jobController.getJobs);

// Get job by ID
router.get("/jobs/:id", jobController.getJobById);

// Update job
router.put("/jobs/:id", jobController.updateJob);

// Delete job
router.delete("/jobs/:id", jobController.deleteJob);

module.exports = router;
