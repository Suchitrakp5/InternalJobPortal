import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Card, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import "./Login.css";

function Login() {
  const [activeTab, setActiveTab] = useState("HR"); // HR or Employee
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post(
      "http://localhost:5000/api/login",
      { email, password, role: activeTab },
      { withCredentials: true }
    )

    .then((res) => {
  if (res.data.success) {
    // ✅ Save user info in localStorage
    localStorage.setItem("user", JSON.stringify({
      email,
      role: activeTab
    }));

    if (activeTab === "HR") {
      navigate("/DashboardHR");
    } else {
      navigate("/DashboardUser");
    }
  } else {
    alert(res.data.message);
  }
})

      .catch((err) => {
        console.error(err);
        alert("Error logging in");
      });
  };

  return (
    <div className="login-page">
    <div className="login-container">
      <div className="tab-container">
        <button
          className={activeTab === "HR" ? "tab active" : "tab"}
          onClick={() => setActiveTab("HR")}
        >
          HR Login
        </button>
        <button
          className={activeTab === "Employee" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Employee")}
        >
          User Login
        </button>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <h2>{activeTab} Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
}

export default Login;
