import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import '../styles/LoginPage.css';

const VITE_URL = import.meta.env.VITE_BACKEND_URL;

function LoginPage({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await axios.post(`${VITE_URL}/auth/login`, { username, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    navigate('/');
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;