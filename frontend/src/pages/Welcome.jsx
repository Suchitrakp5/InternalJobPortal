import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to Internal Job Portal</h1>
      <p className="welcome-text">
        Find and apply for internal opportunities within our organization.
      </p>
      <div className="welcome-buttons">
        <Link to="/Login" className="welcome-btn login-btn">
          Login
        </Link>
        <Link to="/Register" className="welcome-btn register-btn">
          Register
        </Link>
      </div>
    </div>
  );
}
