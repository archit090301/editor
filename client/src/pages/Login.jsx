import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { buttonStyle } from '../styles/buttonStyles';
import './Login.css';

function Login({ onLoginSuccess, onForgotPassword }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle login request
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post(
        '/api/login',
        { ...formData },
        { withCredentials: true }
      );

      const user = res.data.user;
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`login-form ${theme}`} onSubmit={handleLogin}>
      <h2 className="login-title">🔐 Login</h2>

      <label htmlFor="email" className="login-label">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
        className="login-input"
      />

      <label htmlFor="password" className="login-label">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
        className="login-input"
      />

      {errorMsg && (
        <p className="login-error">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="login-button"
        style={buttonStyle}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <button
        type="button"
        onClick={onForgotPassword}
        className="forgot-password-button"
      >
        Forgot Password?
      </button>
    </form>
  );
}

export default Login;
