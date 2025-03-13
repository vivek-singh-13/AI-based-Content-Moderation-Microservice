import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../styles/NotificationsPage.css';

const VITE_URL = import.meta.env.VITE_BACKEND_URL;

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${VITE_URL}/notifications/flagged`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        setNotifications(response.data.reverse());
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [navigate]);

  return (
    <div className="notifications-container">
      <h1>Flagged Comments</h1>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <strong>Post: {notification.postTitle ? notification.postTitle : "Unknown Post"}</strong>
            <p><b>Comment:</b> {notification.text}</p>
            <p><b>Reason:</b> {notification.reason}</p>
          </div>
        ))
      ) : (
        <p>No flagged comments</p>
      )}
    </div>
  );
}

export default NotificationsPage;

