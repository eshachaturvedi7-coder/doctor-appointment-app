import { useState, useEffect } from 'react';
import API from './api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [profile, setProfile] = useState({ experience: "5", fees: "500", address: "XYZ Road, Delhi" });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ experience: "5", fees: "500", address: "XYZ Road, Delhi" });
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProfile = await API.get('/doctors/profile');
        if (resProfile.data) {
          const actualProfile = resProfile.data.profile || (Array.isArray(resProfile.data) ? resProfile.data[0] : resProfile.data);
          if (actualProfile && (actualProfile.experience || actualProfile.fees || actualProfile.address)) {
            setProfile(actualProfile);
            setFormData({ experience: actualProfile.experience, fees: actualProfile.fees, address: actualProfile.address });
          }
        }
      } catch (err) {
        console.log("Profile fetch failed:", err.message);
      }

      try {
        const resAppointments = await API.get('/doctors/appointments'); 
        setAppointments(resAppointments.data);
      } catch (err) {
        console.log("Appointments fetch failed:", err.message);
        setAppointments([
          { _id: '1', patientName: 'Aarav Mehta', date: '2026-06-25', time: '09:30 AM', status: 'Pending', problem: 'Fever & Cold' },
          { _id: '2', patientName: 'Rohan Joshi', date: '2026-06-25', time: '11:00 AM', status: 'Accepted', problem: 'Routine Checkup' },
          { _id: '3', patientName: 'Sanya Malhotra', date: '2026-06-26', time: '04:15 PM', status: 'Pending', problem: 'Skin Allergy' },
          { _id: '4', patientName: 'Vikram Singh', date: '2026-06-27', time: '01:00 PM', status: 'Rejected', problem: 'Back Pain' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = (id, status) => {
    setAppointments(appointments.map(app => app._id === id ? { ...app, status } : app));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    try {
      await API.post('/doctors/create-profile', formData); 
      setProfile(formData);
      setEditMode(false);
      setUpdateMsg('Profile updated successfully! 🌟');
    } catch (err) {
      console.error(err);
      setProfile(formData);
      setEditMode(false);
      setUpdateMsg('Profile updated locally! ✅');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.reload(); 
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', fontSize: '20px', color: '#0056b3', background: '#f8f9fa' }}>
        <div>🔄 Syncing Dashboard Systems...</div>
      </div>
    );
  }

  const totalApps = appointments.length;
  const pendingApps = appointments.filter(a => a.status === 'Pending').length;
  const acceptedApps = appointments.filter(a => a.status === 'Accepted').length;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: '"Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px', color: '#38bdf8' }}>
            <span>🩺</span> CarePulse Pro
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div onClick={() => setActiveTab('overview')} style={{ background: activeTab === 'overview' ? '#0284c7' : 'transparent', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' }}>📊 Overview Dashboard</div>
            <div onClick={() => setActiveTab('appointments')} style={{ background: activeTab === 'appointments' ? '#0284c7' : 'transparent', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'appointments' ? '#fff' : '#94a3b8', fontWeight: activeTab === 'appointments' ? '600' : 'normal', transition: '0.2s' }}>📅 Appointments ({pendingApps})</div>
            <div onClick={() => setActiveTab('profile')} style={{ background: activeTab === 'profile' ? '#0284c7' : 'transparent', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', color: activeTab === 'profile' ? '#fff' : '#94a3b8', fontWeight: activeTab === 'profile' ? '600' : 'normal', transition: '0.2s' }}>⚙️ Profile Settings</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
          🚪 Logout Account
        </button>
      </div>

      {/* WINDOW MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* TOP BAR */}
        <div style={{ background: '#fff', height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', textTransform: 'capitalize' }}>{activeTab} Panel</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></div>
            <div style={{ fontWeight: '600', color: '#4b5563' }}>Dr. Live Panel</div>
          </div>
        </div>

        {/* CONTAINER VIEW */}
        <div style={{ padding: '30px' }}>
          {updateMsg && <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{updateMsg}</div>}

          {/* OVERVIEW SECTION */}
          {activeTab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #0284c7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Total Bookings</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalApps}</div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Pending</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{pendingApps}</div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #10b981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Approved</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{acceptedApps}</div>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #8b5cf6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Session Fee</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{profile.fees}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 10px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📌 Quick Info</h3>
                  <p><strong>Exp:</strong> {profile.experience} Years</p>
                  <p><strong>Address:</strong> {profile.address}</p>
                  <button onClick={() => setActiveTab('profile')} style={{ width: '100%', padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '15px' }}>Edit Profile Setup</button>
                </div>

                <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 10px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>⏰ Today's Schedule Requests</h3>
                  <p style={{ color: '#64748b', marginBottom: '20px' }}>Aapke paas total {pendingApps} pending appointments hain.</p>
                  <button onClick={() => setActiveTab('appointments')} style={{ padding: '10px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Open Appointment Ledger →</button>
                </div>
              </div>
            </>
          )}

          {/* APPOINTMENTS SECTION */}
          {activeTab === 'appointments' && (
            <div style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 20px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📋 Patient List & Schedule Action Registry</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>Patient Name</th>
                    <th style={{ padding: '12px' }}>Date/Time</th>
                    <th style={{ padding: '12px' }}>Issue</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Action Menu</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', fontWeight: '600' }}>{app.patientName}</td>
                      <td style={{ padding: '15px' }}>{app.date} | <small>{app.time}</small></td>
                      <td style={{ padding: '15px', color: '#64748b' }}>{app.problem}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: app.status === 'Accepted' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: app.status === 'Accepted' ? '#15803d' : app.status === 'Rejected' ? '#b91c1c' : '#b45309' }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        {app.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleStatusUpdate(app._id, 'Accepted')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Approve</button>
                            <button onClick={() => handleStatusUpdate(app._id, 'Rejected')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Reject</button>
                          </div>
                        ) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Archived</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
              <h3 style={{ margin: '0 0 20px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>⚙️ Professional Credentials Config</h3>
              {!editMode ? (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                    <p><strong>Years of Active Practice:</strong> {profile.experience} Years</p>
                    <p><strong>Consultation Tier Fee:</strong> ₹{profile.fees}</p>
                    <p><strong>Registered Clinic Address:</strong> {profile.address}</p>
                  </div>
                  <button onClick={() => setEditMode(true)} style={{ padding: '10px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Modify Live Info</button>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ fontWeight: '600', fontSize: '14px' }}>Practice Experience (Years)</label>
                    <input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                  </div>
                  <div>
                    <label style={{ fontWeight: '600', fontSize: '14px' }}>Consultation Fee (₹)</label>
                    <input type="number" value={formData.fees} onChange={(e) => setFormData({...formData, fees: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                  </div>
                  <div>
                    <label style={{ fontWeight: '600', fontSize: '14px' }}>Clinic Suite Location</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Commit Changes</button>
                    <button type="button" onClick={() => setEditMode(false)} style={{ padding: '10px 20px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;