// src/pages/MyApplications.jsx
import React, { useEffect, useState } from "react";
import "./MyApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  const loggedInUserEmail = "kiran@company.com"; // replace with actual logged-in user's email

  useEffect(() => {
    fetch(`http://localhost:5000/api/applications/user?email=${loggedInUserEmail}`)
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch((err) => console.error("Error fetching applications:", err));
  }, []);

  const handleDeleteApplication = (id) => {
    fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setApplications(applications.filter((app) => app.id !== id));
      })
      .catch((err) => console.error("Error deleting application:", err));
  };

  return (
    <div className="applications-page1">
      <h2 className="applications-title1">My Applications</h2>

      {applications.length === 0 ? (
        <p className="no-applications1">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="applications-list1">
          {applications.map((app) => (
            <div key={app.id} className="application-card1">
              <div className="application-header1">
                <h3>{app.title}</h3>
                <span className={`status-badge1 ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>

              <div className="application-details1">
                <p>
                  <strong>Applied on:</strong>{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="application-actions1">
                <button
                  className="delete-btn1"
                  onClick={() => handleDeleteApplication(app.id)}
                >
                  ❌ Withdrawn Application
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
