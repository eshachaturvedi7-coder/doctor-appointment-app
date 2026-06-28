import { useState, useEffect } from 'react';
import API from './api';

const AdminDashboard = ({ onLogout }) => {
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('doctors');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/doctors').then(res => setDoctors(res.data)).catch(() => {
      setDoctors([
        { _id: '1', user: { name: 'Dr. Rahul Sharma' }, specialization: 'Cardiologist', fees: 800, isApproved: false },
        { _id: '2', user: { name: 'Dr. Priya Singh' }, specialization: 'Dermatologist', fees: 600, isApproved: true },
      ]);
    });
  }, []);

  const handleApprove = (id) => {
    setDoctors(doctors.map(d => d._id === id ? { ...d, isApproved: true } : d));
    setMsg('Doctor approved!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleReject = (id) => {
    setDoctors(doctors.filter(d => d._id !== id));
    setMsg('Doctor removed!');
    setTimeout(() => setMsg(''), 3000);
  };

  const approved = doctors.filter(d => d.isApproved).length;
  const pending = doctors.filter(d => !d.isApproved).length;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Segoe UI", sans-serif' }}>
      <div style={{ width: '260px', background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#f59e0b', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
            🛡️ Admin Panel
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div onClick={() => setActiveTab('doctors')} style={{ background: activeTab === 'doctors' ? '#d97706' : 'transparent', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#fff' }}>
              👨‍⚕️ Manage Doctors
            </div>
            <div onClick={() => setActiveTab('stats')} style={{ background: activeTab === 'stats' ? '#d97706' : 'transparent', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'stats' ? '#fff' : '#94a3b8' }}>
              📊 System Stats
            </div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          🚪 Logout
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f3f4f6' }}>
        <div style={{ background: '#fff', height: '70px', display: 'flex', alignItems: 'center', padding: '0 30px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Admin Dashboard</div>
        </div>

        <div style={{ padding: '30px' }}>
          {msg && <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>✅ {msg}</div>}

          {activeTab === 'stats' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #0284c7', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Total Doctors</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>{doctors.length}</div>
              </div>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #10b981', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Approved</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>{approved}</div>
              </div>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Pending</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>{pending}</div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 20px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Doctor Approval Management</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px' }}>Doctor Name</th>
                    <th style={{ padding: '12px' }}>Specialization</th>
                    <th style={{ padding: '12px' }}>Fee</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doc => (
                    <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', fontWeight: '600' }}>{doc.user ? doc.user.name : 'Unknown'}</td>
                      <td style={{ padding: '15px' }}>{doc.specialization}</td>
                      <td style={{ padding: '15px' }}>₹{doc.fees}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: doc.isApproved ? '#dcfce7' : '#fef3c7', color: doc.isApproved ? '#15803d' : '#b45309' }}>
                          {doc.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        {!doc.isApproved ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleApprove(doc._id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Approve</button>
                            <button onClick={() => handleReject(doc._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Reject</button>
                          </div>
                        ) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Active</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;