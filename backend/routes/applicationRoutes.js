const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const applicationController = require("../controllers/applicationController");


// file storage for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resumes"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Apply for a job (with resume upload)
router.post("/applications/apply", upload.single("resume"), applicationController.applyJob);

// User Applications
router.get("/applications/user", applicationController.getUserApplications);

// HR Applications
router.get("/applications", applicationController.getAllApplications);

// Update application status
router.put("/applications/:applicationId/status", applicationController.updateApplicationStatus);

// Get all applications for a specific job (for HR/job poster)
router.get("/applications/job/:jobId", applicationController.getApplicationsByJob);

// Delete application
router.delete("/applications/:applicationId", applicationController.deleteApplication);



module.exports = router;
