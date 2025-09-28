import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword';
import DashboardUser from './pages/DashboardUser';
import DashboardHR from './pages/DashboardHR';
import JobPosting from "./modules/JobPosting";
import InterviewScheduling from './modules/InterviewScheduling'; 
import JobListings from './modules/JobListings';   
import Applications from './modules/Applications';
import Notifications from './modules/Notifications';
import MyApplications from "./pages/MyApplications";
 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/DashboardHR" element={<DashboardHR />} />
        <Route path="/DashboardUser" element={<DashboardUser />} />
        <Route path="/jobposting" element={<JobPosting />} />
        <Route path="/interviewscheduling" element={<InterviewScheduling />} />
        <Route path="/joblistings" element={<JobListings />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      
        {/* Add more routes here later */}
      </Routes>
    </Router>
  </React.StrictMode>
)
