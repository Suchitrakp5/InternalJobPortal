// Applications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Applications.css"; 

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/applications")
      .then(res => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/applications/${id}`, { status })
      .then(() => {
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status } : app
        ));
      })
      .catch(err => console.error(err));
  };

  const filteredApps = filter === "All" 
    ? applications 
    : applications.filter(app => app.status === filter);

  if (loading) {
    return (
      <div className="applications-container">
        <h2>Applications Management</h2>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <h2>Applications Management</h2>
      <p className="applications-subtitle">Track and manage employee applications for internal positions</p>

      <div className="filter-box">
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Applications</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <span className="application-count">
          {filteredApps.length} application{filteredApps.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {filteredApps.length === 0 ? (
        <div className="no-applications">
          <p>No applications found for the selected filter.</p>
        </div>
      ) : (
        <ul className="applications-list">
          {filteredApps.map(app => (
            <li key={app.id} className="application-item">
              <div className="application-header">
                <div className="applicant-info">
                  <strong className="applicant-name">{app.name || 'Unknown Applicant'}</strong>
                  <span className="applicant-email">{app.email || 'No email provided'}</span>
                </div>
                <div className="application-status">
                  <span className={`status-badge status-${app.status?.toLowerCase() || 'pending'}`}>
                    {app.status || 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="application-details">
                <div className="job-info">
                  <strong>Applied for:</strong> {app.title || 'Unknown Position'}
                </div>
                <div className="application-date">
                  <strong>Applied on:</strong> {app.appliedAt || 'Date not available'}
                </div>
                <div className="resume-info">
                  <strong>Resume:</strong> {app.resume ? '✅ Uploaded' : '❌ Not uploaded'}
                </div>
              </div>

              <div className="application-actions">
                <label>Update Status:</label>
                <select
                  className="status-select"
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                  value={app.status || 'Pending'}
                >
                  <option value="Pending">Pending</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button className="view-details-btn">View Details</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
