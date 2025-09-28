// src/modules/JobPosting.jsx
import React, { useState } from "react";
import axios from "axios";
import "./JobPosting.css"; 

export default function JobPosting() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [skillSet, setSkillSet] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/jobs", {
      title,
      department,
      location,
      skillSet,      
      employmentType,
      salary,
      startDate,
      endDate,
    })
      .then(() => {
        alert("Job created successfully!");
        setTitle("");
        setDepartment("");
        setLocation("");
        setSkillSet("");
  
        setEmploymentType("");
        setSalary("");
        setStartDate("");
        setEndDate("");
      })
      .catch(err => console.error(err));
  };

  return (
     <div className="job-posting-page">
      <div className="job-form-card">
      <h2>Create New Job</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br></br>
        <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        <br></br>
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <br></br>
        <textarea placeholder="Skill Set Required" value={skillSet} onChange={(e) => setSkillSet(e.target.value)} required />
        <br></br>
        <input type="text" placeholder="Employment Type (e.g., Full-Time, Part-Time)" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} required />
        <br></br>
        <input type="text" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />
        <br></br>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onFocus={(e) => e.target.type = "date"}
          onBlur={(e) => !e.target.value && (e.target.type = "text")}
          placeholder="Start Date (dd-mm-yyyy)"
          required
        />
        <br></br>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onFocus={(e) => e.target.type = "date"}
          onBlur={(e) => !e.target.value && (e.target.type = "text")}
          placeholder="End Date (dd-mm-yyyy)"
          required
        />
        <br></br>
        <button type="submit">Post Job</button>
      </form>
    </div>
    </div>
  );
}
