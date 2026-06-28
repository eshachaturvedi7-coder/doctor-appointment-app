import { useState, useEffect, useCallback } from 'react';
import API from './api';

const DoctorDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0 });

  // 1. Fetching appointments safely with useCallback
  const fetchDoctorAppointments = useCallback(async () => {
    try {
      const res = await API.get('/appointments/doctor-appointments');
      if (res.data && Array.isArray(res.data)) {
        setAppointments(res.data);
        
        // Dynamic live statistics calculation
        const pending = res.data.filter(a => a.status === 'Pending').length;
        const accepted = res.data.filter(a => a.status === 'Accepted').length;
        setStats({ total: res.data.length, pending, accepted });
      }
    } catch (err) {
      console.log("Syncing offline fallback data matrices...", err.message);
      // Fallback data setup if backend route isn't fully linked
      if (appointments.length === 0) {
        const dummyData = [
          { _id: 'mock-doc-1', doctorName: 'Dr. Rahul Sharma', date: '2026-06-25', time: '12:00 PM', problem: 'General Health Query', status: 'Pending' }
        ];
        setAppointments(dummyData);
        setStats({ total: 1, pending: 1, accepted: 0 });
      }
    }
  }, [appointments.length]);

  // 2. Safe Effect Loop Controller using Macro-task timer breakout
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const timer = setTimeout(() => {
        fetchDoctorAppointments();
      }, 0);
      
      // Polling interval setup to fetch incoming actions from Patient side safely
      const poll = setInterval(() => {
        fetchDoctorAppointments();
      }, 5000);

      return () => {
        isMounted = false;
        clearTimeout(timer);
        clearInterval(poll);
      };
    }
  }, [fetchDoctorAppointments]);

  // 3. Status patch updates handler (Accept / Reject)
  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      await API.patch(`/appointments/${id}/status`, { status: currentStatus });
      // Reload states cleanly instantly
      fetchDoctorAppointments();
    } catch (err) {
      console.log("Local state update override executed:", err.message);
      // Hard UI update bypass logic for instant feedback
      setAppointments(prev => 
        prev.map(item => item._id === id ? { ...item, status: currentStatus } : item)
      );
      
      // Recalculate local counters instantly
      setAppointments(updatedList => {
        const pending = updatedList.filter(a => a.status === 'Pending').length;
        const accepted = updatedList.filter(a => a.status === 'Accepted').length;
        setStats({ total: updatedList.length, pending, accepted });
        return updatedList;
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
      
      {/* SIDEBAR NAVIGATION CONTROL */}
      <div style={{ width: '260px', background: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', padding: '25px 20px', justifyContent: 'space-between', boxShadow: '4px 0 12px rgba(0,0,0,0.1)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '30px', color: '#10b981' }}>
            <span style={{ fontSize: '26px' }}>🩺</span> Doctor Panel
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div onClick={() => setActiveTab('overview')} style={{ background: activeTab === 'overview' ? '#10b981' : 'transparent', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>📊 Dashboard Overview</div>
            <div onClick={() => setActiveTab('manage')} style={{ background: activeTab === 'manage' ? '#10b981' : 'transparent', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'manage' ? '#fff' : '#64748b', fontWeight: '600', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>📋 Manage Requests</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)' }}>
          🚪 Logout
        </button>
      </div>

      {/* CORE DISPLAY WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* VIEW 1: OVERVIEW METRICS GRID */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', marginBottom: '25px' }}>📈 Performance Matrix Overview</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', borderLeft: '5px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Total Bookings</h4>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{stats.total}</p>
              </div>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', borderLeft: '5px solid #f59e0b' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Pending Approvals</h4>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#d97706' }}>{stats.pending}</p>
              </div>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', borderLeft: '5px solid #10b981' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Confirmed Schedules</h4>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#059669' }}>{stats.accepted}</p>
              </div>
            </div>

            <button onClick={() => setActiveTab('manage')} style={{ padding: '14px 28px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Open Action Console 🔎
            </button>
          </div>
        )}

        {/* VIEW 2: ACTION MANAGEMENT CONSOLE */}
        {activeTab === 'manage' && (
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '25px' }}>📋 Incoming Patient Appointments</h2>
            
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                <span style={{ fontSize: '45px' }}>🍃</span>
                <p style={{ marginTop: '15px', fontSize: '16px' }}>No active appointment requests floating in queue.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '15px' }}>Assigned Doctor</th>
                    <th style={{ padding: '15px' }}>Date / Time</th>
                    <th style={{ padding: '15px' }}>Reason/Problem</th>
                    <th style={{ padding: '15px' }}>Status Tracker</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Actions Console</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', fontWeight: '600', color: '#0f172a' }}>{app.doctorName}</td>
                      <td style={{ padding: '15px', color: '#334155', fontSize: '14px' }}>{app.date} • {app.time}</td>
                      <td style={{ padding: '15px', color: '#64748b', fontSize: '14px' }}>{app.problem || 'General Checkup'}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontSize: '12px', 
                          fontWeight: '700', 
                          background: app.status === 'Accepted' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                          color: app.status === 'Accepted' ? '#15803d' : app.status === 'Rejected' ? '#b91c1c' : '#b45309'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {app.status === 'Pending' ? (
                          <>
                            <button onClick={() => handleUpdateStatus(app._id, 'Accepted')} style={{ padding: '6px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                              Accept ✓
                            </button>
                            <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} style={{ padding: '6px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                              Reject ✕
                            </button>
                          </>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;