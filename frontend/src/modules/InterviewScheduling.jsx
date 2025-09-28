// src/modules/InterviewScheduling.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InterviewScheduling.css";

export default function InterviewScheduling() {
  const [interviews, setInterviews] = useState([]);
  const [candidate, setCandidate] = useState("");
  const [position, setPosition] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Technical");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/interviews")
      .then(res => {
        setInterviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const scheduleInterview = (e) => {
    e.preventDefault();
    const interviewData = {
      candidate,
      position,
      interviewer,
      date,
      time,
      type,
      notes,
      status: "Scheduled"
    };

    axios.post("http://localhost:5000/api/interviews", interviewData)
      .then(res => {
        setInterviews([...interviews, res.data]);
        // Reset form
        setCandidate("");
        setPosition("");
        setInterviewer("");
        setDate("");
        setTime("");
        setType("Technical");
        setNotes("");
      })
      .catch(err => console.error(err));
  };

  const updateInterviewStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/interviews/${id}`, { status })
      .then(() => {
        setInterviews(interviews.map(int => 
          int.id === id ? { ...int, status } : int
        ));
      })
      .catch(err => console.error(err));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="interview-container">
        <h2>Interview Scheduling</h2>
        <p>Loading interviews...</p>
      </div>
    );
  }

  return (
    <div className="interview-container">
      <h2>Interview Scheduling</h2>
      <div className="interview-card">
        <p className="interview-subtitle">Schedule and manage interviews for internal job applications</p>
        
        <form onSubmit={scheduleInterview} className="interview-form">
          <div className="form-row">
            <input 
              type="text" 
              placeholder="Candidate Name" 
              value={candidate} 
              onChange={(e) => setCandidate(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Position Applied For" 
              value={position} 
              onChange={(e) => setPosition(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-row">
            <input 
              type="text" 
              placeholder="Interviewer Name" 
              value={interviewer} 
              onChange={(e) => setInterviewer(e.target.value)} 
              required 
            />
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
              <option value="Final">Final Interview</option>
              <option value="Screening">Screening Call</option>
            </select>
          </div>
          
          <div className="form-row">
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
            />
          </div>
          
          <textarea 
            placeholder="Interview Notes (Optional)" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          />
          
          <button type="submit" className="schedule-btn">Schedule Interview</button>
        </form>

        <div className="upcoming-section">
          <h3>Upcoming Interviews</h3>
          {interviews.length === 0 ? (
            <p className="no-interviews">No interviews scheduled.</p>
          ) : (
            <div className="interviews-list">
              {interviews.map(int => (
                <div key={int.id} className="interview-item">
                  <div className="interview-header">
                    <div className="interview-info">
                      <strong className="candidate-name">{int.candidate || 'Unknown Candidate'}</strong>
                      <span className="position">{int.position || 'Unknown Position'}</span>
                    </div>
                    <div className="interview-status">
                      <span className={`status-badge status-${int.status?.toLowerCase() || 'scheduled'}`}>
                        {int.status || 'Scheduled'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="interview-details">
                    <div><strong>Interviewer:</strong> {int.interviewer || 'Not assigned'}</div>
                    <div><strong>Type:</strong> {int.type || 'Not specified'}</div>
                    <div><strong>Date:</strong> {int.date ? formatDate(int.date) : 'Not set'}</div>
                    <div><strong>Time:</strong> {int.time ? formatTime(int.time) : 'Not set'}</div>
                    {int.notes && <div><strong>Notes:</strong> {int.notes}</div>}
                  </div>
                  
                  <div className="interview-actions">
                    <select
                      className="status-select"
                      onChange={(e) => updateInterviewStatus(int.id, e.target.value)}
                      value={int.status || 'Scheduled'}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                    <button className="send-reminder-btn">Send Reminder</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
