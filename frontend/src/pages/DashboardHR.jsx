// src/pages/DashboardHR.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardHR.css"; // external CSS

import JobPosting from "../modules/JobPosting";
import JobListings from "../modules/JobListings";
import Applications from "../modules/Applications";
import InterviewScheduling from "../modules/InterviewScheduling";
import Notifications from "../modules/Notifications";

export default function DashboardHR() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState("jobPosting");
  const [showConfirm, setShowConfirm] = useState(false);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "HR") {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Welcome HR</h2>
        <p>{user.name}</p>
        <ul>
          <li onClick={() => setActiveModule("jobPosting")}>➕ Create Job</li>
          <li onClick={() => setActiveModule("jobListings")}>📋 View Jobs</li>
          <li onClick={() => setActiveModule("applications")}>📂 Applications</li>
          <li onClick={() => setActiveModule("interviews")}>📅 Interview Scheduling</li>
          <li onClick={() => setActiveModule("notifications")}>🔔 Notifications</li>
        </ul>

         {/* Logout Button */}
       <button className="logout-button" onClick={() => setShowConfirm(true)}>
          🚪 Logout
       </button>
      </div>


      {/* Main Content */}
      <div className="content">
        {activeModule === "jobPosting" && <JobPosting />}
        {activeModule === "jobListings" && <JobListings setActiveModule={setActiveModule} />}
        {activeModule === "applications" && <Applications />}
        {activeModule === "interviews" && <InterviewScheduling />}
        {activeModule === "notifications" && <Notifications />}
      </div>
{/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to logout?</p>
            <div className="confirm-buttons">
              <button
                className="confirm-yes"
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Yes
              </button>
              <button
                className="confirm-cancel"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
