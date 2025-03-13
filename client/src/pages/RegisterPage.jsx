import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import '../styles/RegisterPage.css';

const VITE_URL = import.meta.env.VITE_BACKEND_URL;

function RegisterPage({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await axios.post(`${VITE_URL}/auth/signup`, { username, password });
    alert('Registration successful! Logging you in...');
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    navigate('/');
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage;