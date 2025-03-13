import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotificationsPage from './pages/NotificationsPage';
import PostPage from './pages/PostPage';
import './App.css';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage token={token} setToken={setToken} />} />
        {token && <Route path="/notifications" element={<NotificationsPage />} />}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage setToken={setToken} />} />
        <Route path="/post/:id" element={<PostPage token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;


