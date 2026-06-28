import { useState, useEffect } from 'react';
import Login from './login';
import PatientDashboard from './PatientDashboard';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  // Role based redirection control routing
  if (role === 'doctor') {
    return <DoctorDashboard onLogout={handleLogout} />;
  } else if (role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  } else {
    return <PatientDashboard onLogout={handleLogout} />;
  }
}

export default App;