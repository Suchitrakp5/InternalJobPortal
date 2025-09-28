import React, { useState } from "react";
import axios from "axios";
import "./ApplyForm.css";

const ApplyForm = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!job || !job.id) {
    alert("Job ID is missing!");
    return;
  }

  const data = new FormData();
  data.append("jobId", job.id);
  data.append("name", formData.name);
  // data.append("email", formData.email);
  data.append("phone", formData.phone);
  data.append("resume", formData.resume); // must match multer field name
  data.append("email", formData.email);


  try {
    // Let Axios automatically set Content-Type for FormData
    await axios.post("http://localhost:5000/api/applications/apply", data);

    alert("Application submitted successfully!");
    onClose();
  } catch (error) {
    console.error("Error submitting application:", error);
    alert("Failed to submit application. Check console for details.");
  }
};


  return (
    <div className="apply-modal">
      <div className="apply-modal-content">
        <h2>Apply for {job.title}</h2>
        <form onSubmit={handleSubmit} className="apply-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            required
            onChange={handleChange}
          />
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            required
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
