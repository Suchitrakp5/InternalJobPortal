const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");

// Schedule an interview
router.post("/interviews", interviewController.scheduleInterview);

// Get all upcoming interviews
router.get("/interviews", interviewController.getInterviews);

module.exports = router;
