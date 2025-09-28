import React, { useState, useEffect } from 'react';
import './DashboardUser.css';
import axios from "axios";
import MyApplications from './MyApplications'; // adjust path if needed
import ApplyForm from "../modules/ApplyForm";
import { useNavigate } from "react-router-dom";


const DashboardUser = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    department: 'All',
    skills: 'All',
    location: 'All',
    employment: 'All',
    minSalary: ''
  });
  

  // Load jobs from HR posts when component mounts
  useEffect(() => {
    loadJobsFromHR();
  }, []);

  // Simulate API call to fetch jobs posted by HR
const fetchJobsFromAPI = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/jobs");

    return response.data.map((job) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      skills: job.skillSet ? job.skillSet.split(",").map(s => s.trim()) : [],
      employment: job.employmentType || job.employment, // match your DB column
      salary: job.salary,
      posted: job.startDate ? new Date(job.startDate).toLocaleDateString() : "Recently",
      postedDate: job.startDate,

    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
  // Get jobs posted by HR (replace this with actual database/API call)
  const getHRPostedJobs = () => {
 
    // Return empty array - no jobs posted by HR yet
    return [];
  };

  const loadJobsFromHR = async () => {
    setLoading(true);
    try {
      const hrJobs = await fetchJobsFromAPI();
      setJobs(hrJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };


  // Dynamic filter options based on available jobs
  const getDynamicOptions = (field) => {
    if (jobs.length === 0) return ['All'];
    
    let options = ['All'];
    if (field === 'skills') {
      const allSkills = jobs.flatMap(job => job.skills || []);
      options = [...options, ...new Set(allSkills)];
    } else {
      const values = jobs.map(job => job[field]).filter(Boolean);
      options = [...options, ...new Set(values)];
    }
    return options;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = filters.department === 'All' || job.department === filters.department;
    const matchesLocation = filters.location === 'All' || job.location === filters.location;
    const matchesEmployment = filters.employment === 'All' || job.employment === filters.employment;
    const matchesSkills = filters.skills === 'All' || job.skills.some(skill => 
      skill.toLowerCase().includes(filters.skills.toLowerCase())
    );
    const matchesSalary = !filters.minSalary || job.salary >= parseInt(filters.minSalary);
    return matchesSearch && matchesDepartment && matchesLocation && matchesEmployment && matchesSkills && matchesSalary;
  });

  const resetFilters = () => {
    setFilters({
      department: 'All',
      skills: 'All',
      location: 'All',
      employment: 'All',
      minSalary: ''
    });
    setSearchTerm('');
  };

  const handleRefreshJobs = () => {
    loadJobsFromHR();
  };

  const handleApplyJob = (job) => {
  setSelectedJob(job); // open form
};

  const handleSaveJob = (jobId) => {
    // Handle save job logic
    console.log('Saving job:', jobId);
    alert('Job saved to your favorites!');
  };

  const handleLogout = () => {
  // Clear any authentication/session storage if needed
   const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
  sessionStorage.clear();
  localStorage.removeItem("userToken");
    sessionStorage.clear();

  // Redirect to Welcome page
  navigate("/"); 
}
};

  

  const menuItems = [
    { id: 'jobs', label: 'Find Jobs', icon: '💼' },
    { id: 'applications', label: 'My Applications', icon: '📄' },
    { id: 'interviews', label: 'Interviews', icon: '🎯' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const renderJobsContent = () => (
    <div className="jobs-page-content">
      {/* Header and Search */}
      <div className="page-header-section">
        <div className="content-header">
          <h1>Find Your Dream Job</h1>
          <p>Discover opportunities posted by HR teams</p>
        </div>

        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search jobs by title or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="jobs-listing-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <h3>Loading Jobs...</h3>
            <p>Fetching latest job postings from HR...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs-found">
            <div className="no-jobs-icon">💼</div>
            <h3>No Jobs Posted Yet</h3>
            <p>There are currently no jobs posted by HR. Please check back later.</p>
            <button className="refresh-btn" onClick={handleRefreshJobs}>
              🔄 Refresh Jobs
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs-found">
            <div className="no-jobs-icon">🔍</div>
            <h3>No jobs match your criteria</h3>
            <p>Try adjusting your search terms or filters</p>
            <button className="clear-filters-btn" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="jobs-listing">
            {filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-info">
                    <div className="company-logo">{job.logo}</div>
                    <div className="job-details">
                      <h3>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                      <div className="job-meta">
                        <span>📍 {job.location}</span>
                        <span>⏰ {job.employment}</span>
                        <span>💰 ₹{job.salary.toLocaleString()}</span>
                        <span>📅 {job.posted}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="job-skills">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>

                <div className="job-actions">
                  <button 
                    className="save-btn"
                    onClick={() => handleSaveJob(job.id)}
                  >
                    ❤️ Save
                  </button>
                  <button 
                    className="apply-btn"
                    onClick={() => handleApplyJob(job)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

const renderOtherContent = () => {
  switch (activeTab) {
    case 'applications':
      return <MyApplications />;
    case 'interviews':
      return (
        <div className="content-header">
          <h1>Upcoming Interviews</h1>
          <p>Manage your interview schedule</p>
        </div>
      );
    case 'profile':
      return (
        <div className="content-header">
          <h1>My Profile</h1>
          <p>Update your profile information and preferences</p>
        </div>
      );
    case 'notifications':
      return (
        <div className="content-header">
          <h1>Notifications</h1>
          <p>Stay updated with the latest job alerts and updates</p>
        </div>
      );
    default:
      return null;
  }
};

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
      <header className="top-navbar">
        <div className="navbar-content">
          <div className="logo">
            <h1>JobPortal</h1>
          </div>
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">U</div>
              <span>User Name</span>
            </div>
            <button className="nav-btn">⚙️</button>
            <button className="nav-btn" onClick={handleLogout}>🚪</button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Left Sidebar - Navigation */}
        <aside className="left-sidebar">
          <nav className="sidebar-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Sidebar - Filters (only show on jobs page) */}
        {activeTab === 'jobs' && (
          <aside className="right-sidebar">
            <div className="filters-container">
              <div className="filters-header">
                <h3>Filters</h3>
                <button onClick={resetFilters} className="clear-filters">Clear all</button>
              </div>

              <div className="filter-group">
                <label>Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="filter-select"
                >
                  {getDynamicOptions('department').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Skills</label>
                <select
                  value={filters.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                  className="filter-select"
                >
                  {getDynamicOptions('skills').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="filter-select"
                >
                  {getDynamicOptions('location').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Employment Type</label>
                <select
                  value={filters.employment}
                  onChange={(e) => handleFilterChange('employment', e.target.value)}
                  className="filter-select"
                >
                  {getDynamicOptions('employment').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Minimum Salary (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={filters.minSalary}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="jobs-count">
                <strong>{filteredJobs.length}</strong> jobs found
              </div>

              {jobs.length > 0 && (
                <button className="refresh-jobs-btn" onClick={handleRefreshJobs}>
                  🔄 Refresh Jobs
                </button>
              )}
            </div>
          </aside>
        )}
        {selectedJob && (
  <ApplyForm
    job={selectedJob}
    onClose={() => setSelectedJob(null)}
  />
)}


        {/* Main Content Area */}
        <main className={`content-area ${activeTab === 'jobs' ? 'with-right-sidebar' : 'no-filters'}`}>
          <div className="main-content">
            {activeTab === 'jobs' ? renderJobsContent() : renderOtherContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardUser;