// src/modules/Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/notifications")
      .then(res => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const markAsRead = (id) => {
    axios.put(`http://localhost:5000/api/notifications/${id}`, { read: true })
      .then(() => {
        setNotifications(notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ));
      })
      .catch(err => console.error(err));
  };

  const deleteNotification = (id) => {
    axios.delete(`http://localhost:5000/api/notifications/${id}`)
      .then(() => {
        setNotifications(notifications.filter(notif => notif.id !== id));
      })
      .catch(err => console.error(err));
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'job':
        return '💼';
      case 'interview':
        return '📅';
      case 'application':
        return '📝';
      case 'reminder':
        return '⏰';
      case 'status':
        return '📊';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'job':
        return 'job';
      case 'interview':
        return 'interview';
      case 'application':
        return 'application';
      case 'reminder':
        return 'reminder';
      case 'status':
        return 'status';
      default:
        return 'default';
    }
  };

  const filteredNotifications = filter === "All" 
    ? notifications 
    : notifications.filter(notif => notif.type === filter);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <h2>Notifications</h2>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications Center</h2>
        <p className="notifications-subtitle">Stay updated with job applications, interviews, and system updates</p>
        
        <div className="notifications-stats">
          <span className="unread-count">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="filter-box">
        <label>Filter by Type:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Notifications</option>
          <option value="Job">Job Postings</option>
          <option value="Interview">Interview Updates</option>
          <option value="Application">Application Status</option>
          <option value="Reminder">Reminders</option>
          <option value="Status">Status Updates</option>
        </select>
        <span className="notification-count">
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications found for the selected filter.</p>
        </div>
      ) : (
        <ul className="notifications-list">
          {filteredNotifications.map(notif => (
            <li key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'} ${getNotificationColor(notif.type)}`}>
              <div className="notification-icon">
                {getNotificationIcon(notif.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-type">{notif.type || 'General'}</span>
                  <span className="notification-date">
                    {notif.date ? new Date(notif.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date not available'}
                  </span>
                </div>
                
                <div className="notification-message">
                  {notif.message || 'No message content'}
                </div>
                
                {notif.details && (
                  <div className="notification-details">
                    {notif.details}
                  </div>
                )}
              </div>
              
              <div className="notification-actions">
                {!notif.read && (
                  <button 
                    className="mark-read-btn"
                    onClick={() => markAsRead(notif.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button 
                  className="delete-notification-btn"
                  onClick={() => deleteNotification(notif.id)}
                  title="Delete notification"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {notifications.length > 0 && (
        <div className="notifications-footer">
          <button 
            className="mark-all-read-btn"
            onClick={() => {
              notifications.forEach(notif => {
                if (!notif.read) markAsRead(notif.id);
              });
            }}
          >
            Mark All as Read
          </button>
          <button 
            className="clear-all-btn"
            onClick={() => {
              notifications.forEach(notif => deleteNotification(notif.id));
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
