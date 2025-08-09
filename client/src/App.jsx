import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Editor from './pages/Editor';
import Profile from './pages/Profile';
import CollabRoom from './pages/CollabRoom';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard'; // ✅ Make sure this exists
import { useTheme } from './ThemeContext';
import './theme.css';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  const [view, setView] = useState('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // ✅ New state
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) {
      const token = path.split('/reset-password/')[1];
      setView(`reset:${token}`);
      return;
    }

    axios.get('/api/check-auth')
      .then((res) => {
        setIsAuthenticated(true);
        setUserRole(res.data.user.role); // ✅ Save role
        setView(res.data.user.role === 'admin' ? 'admin' : 'editor'); // ✅ Role-based view
      })
      .catch(() => {
        setIsAuthenticated(false);
        setView('login');
      });
  }, []);

  const handleLogout = () => {
    axios.post('/api/logout').then(() => {
      setIsAuthenticated(false);
      setUserRole(null);
      setView('login');
      setShowDropdown(false);
    });
  };

  const navButtonStyle = {
    marginRight: '10px',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: theme === 'dark' ? '#444' : '#ddd',
    color: theme === 'dark' ? '#eee' : '#000',
    fontWeight: 600,
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <button onClick={toggleTheme} style={navButtonStyle}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>

          {!isAuthenticated && (
            <>
              <button onClick={() => setView('login')} style={navButtonStyle}>Login</button>
              <button onClick={() => setView('register')} style={navButtonStyle}>Register</button>
            </>
          )}

          {isAuthenticated && (
            <>
              {userRole === 'admin' && (
                <button onClick={() => setView('admin')} style={navButtonStyle}>Admin Dashboard</button>
              )}
              <button onClick={() => setView('editor')} style={navButtonStyle}>Editor</button>
              <button onClick={() => setView('collab')} style={navButtonStyle}>Collaborative Room</button>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div style={{ position: 'relative' }}>
            <img
              src="https://i.pravatar.cc/32"
              alt="Profile"
              onClick={() => setShowDropdown(prev => !prev)}
              style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}
            />

            {showDropdown && (
              <div className="profile-dropdown">
                <button onClick={() => { setView('profile'); setShowDropdown(false); }}>View Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* PAGES */}
      {view === 'login' && (
        <Login
          onLoginSuccess={(user) => {
            setIsAuthenticated(true);
            setUserRole(user.role); // ✅ Track user role
            setView(user.role === 'admin' ? 'admin' : 'editor'); // ✅ Go to admin if role is admin
          }}
          onForgotPassword={() => setView('forgot')}
        />
      )}
      {view === 'register' && <Register onRegisterSuccess={() => setView('login')} />}
      {view === 'editor' && isAuthenticated && <Editor />}
      {view === 'profile' && isAuthenticated && <Profile />}
      {view === 'collab' && isAuthenticated && <CollabRoom />}
      {view === 'admin' && userRole === 'admin' && <AdminDashboard onBack={() => setView('profile')} />}
      {view === 'editor' && !isAuthenticated && <p>You must be logged in</p>}
      {view === 'forgot' && <ForgotPassword onBack={() => setView('login')} />}
      {view.startsWith('reset:') && <ResetPassword token={view.split(':')[1]} onBack={() => setView('login')} />}
    </div>
  );
}

export default App;
