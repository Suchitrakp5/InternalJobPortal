import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobListings.css";

export default function JobListings({ setActiveModule }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/jobs/${id}`)
      .then(() => setJobs(jobs.filter((job) => job.id !== id)))
      .catch((err) => console.error(err));
  };

  const handleAddNewJob = () => {
    setActiveModule("jobPosting");
  };

  return (
    <div className="job-listings-page">
  <div className="job-listings-container">
    {/* Header stays fixed */}
    <div className="job-header">
      <h2>Job Postings</h2>
      <button className="add-job-btn" onClick={handleAddNewJob}>
        ➕ Add New Job
      </button>
    </div>
        <div className="job-grid">
          {jobs.length === 0 ? (
            <p>No job postings available.</p>
          ) : (
            jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-desc">{job.description || " "}</p>

                <p>
                  📂 <strong>Dept:</strong> {job.department || "N/A"}
                </p>
                <p>
                  📍 <strong>Location:</strong> {job.location || "N/A"}
                </p>
                <p>
                  ⚒ <strong>Skills:</strong> {job.skillSet || "N/A"}
                </p>
                <p>
                  💼 <strong>Employment:</strong>{" "}
                  {job.employmentType || "N/A"}
                </p>
                <p>
                  💰 <strong>Salary:</strong> {job.salary || "N/A"}
                </p>
                <p>
              📅 <strong>Start:</strong> {job.startDate ? job.startDate.split("T")[0] : "N/A"} |{" "}
                 <strong>End:</strong> {job.endDate ? job.endDate.split("T")[0] : "N/A"}
                </p>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}