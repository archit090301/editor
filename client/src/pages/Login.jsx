import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { buttonStyle } from '../styles/buttonStyles';
import './Login.css';

function Login({ onLoginSuccess, onForgotPassword }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/api/login',
        { email, password },
        { withCredentials: true }
      );

      const user = res.data.user;
      alert(`Login successful as ${user.role}`);
      onLoginSuccess(user); // ⬅️ Pass the user with role
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form
      className="login-form"
      style={{
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
        color: theme === 'dark' ? '#eee' : '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        borderRadius: '12px',
        width: '400px',
        margin: '80px auto',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.08)'
      }}
      onSubmit={handleLogin}
    >
      <h2>🔐 Login</h2>

      <input
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
        style={{
          backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
          color: theme === 'dark' ? '#eee' : '#000',
          marginBottom: '15px',
          padding: '12px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />

      <input
        className="login-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={{
          backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
          color: theme === 'dark' ? '#eee' : '#000',
          marginBottom: '15px',
          padding: '12px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />

      {errorMsg && <p className="login-error" style={{ color: 'red', marginBottom: '15px' }}>{errorMsg}</p>}

      <button type="submit" style={{ ...buttonStyle, width: '100%', marginBottom: '10px' }}>
        Login
      </button>

      <button
        type="button"
        onClick={onForgotPassword}
        className="forgot-password-button"
        style={{
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
      >
        Forgot Password?
      </button>
    </form>
  );
}

export default Login;
