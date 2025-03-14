import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import '../styles/HomePage.css';

const VITE_URL = import.meta.env.VITE_BACKEND_URL;


function HomePage({ token, setToken }) {
  //console.log(import.meta.env)
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get(`${VITE_URL}/posts`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });

    if (token) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${VITE_URL}/comments/flagged`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const enrichedNotifications = response.data.map(notification => ({
            ...notification,
            postTitle: notification.postTitle || "Unknown Post"
          }));
          setNotifications(enrichedNotifications.reverse()); // Newest on top
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [token]);

  return (
    <div className="home-container">
      <div className="navbar">
        {token && (
          <div className="notification-container">
            <button className="notification-button" onClick={() => navigate('/notifications')}>
              🔔 {notifications.length > 0 && <span className="notification-bubble">{notifications.length}</span>}
            </button>
          </div>
        )}
        {!token ? (
          <div className="auth-buttons">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        ) : (
          <button onClick={() => {
            localStorage.removeItem('token');
            setToken(null);
          }} className="logout-button">Logout</button>
        )}
      </div>
      <h1>Posts</h1>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <Link to={`/post/${post._id}`}>View Comments</Link>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default HomePage;