import { useState } from 'react';
import API from './api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'patient' });
  const [message, setMessage] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const res = await API.post('/auth/register', {
          name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        onLogin(res.data.token, res.data.user.role);
      } else {
        const res = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        onLogin(res.data.token, res.data.user.role);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Segoe UI", sans-serif' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🩺</div>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>CarePulse Pro</h2>
          <p style={{ color: '#64748b', marginTop: '5px' }}>{isRegister ? 'Create your account' : 'Sign in to your account'}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            style={{ padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            required
          />

         <select
  value={formData.role}
  onChange={e => setFormData({...formData, role: e.target.value})}
  style={{ padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', color: '#1e293b', cursor: 'pointer' }}>
  <option value="patient">🤒 Patient</option>
  <option value="doctor">👨‍⚕️ Doctor</option>
  <option value="admin">🛡️ Admin</option>
</select>

          <button
            type="submit"
            style={{ padding: '13px', fontSize: '16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '5px' }}>
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '15px', padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center', fontWeight: '600' }}>
            {message}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: '#0284c7', cursor: 'pointer', fontWeight: '600' }}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;