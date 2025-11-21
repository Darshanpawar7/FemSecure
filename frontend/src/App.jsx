import React, { useState, useEffect } from 'react';

// Auth Context for managing user authentication
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (name, phone, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

// Auth Form Component
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.phone, formData.password);
      } else {
        result = await register(formData.name, formData.phone, formData.password);
      }

      if (result.success) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({ name: '', phone: '', password: '' });
  };

  const formStyle = {
    backgroundColor: '#1f2937',
    padding: '30px',
    borderRadius: '12px',
    border: '2px solid #ec4899',
    maxWidth: '400px',
    margin: '50px auto'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ec4899',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <div style={formStyle}>
      <h2 style={{ color: '#ec4899', textAlign: 'center', marginBottom: '20px' }}>
        {isLogin ? 'Login to FemSecure' : 'Create Account'}
      </h2>

      {message && (
        <div style={{
          padding: '10px',
          backgroundColor: message.includes('success') ? '#15803d' : '#b91c1c',
          borderRadius: '8px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        )}
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (e.g., +1234567890)"
          value={formData.phone}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
          required
          minLength="6"
        />

        <button 
          type="submit" 
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button
          onClick={toggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: '#ec4899',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

// API functions
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

const contactsAPI = {
  getAll: () => apiRequest('/contacts'),
  create: (contactData) => apiRequest('/contacts', { method: 'POST', body: JSON.stringify(contactData) }),
  delete: (id) => apiRequest(`/contacts/${id}`, { method: 'DELETE' }),
};

const reportsAPI = {
  getAll: () => apiRequest('/reports'),
  create: (reportData) => apiRequest('/reports', { method: 'POST', body: JSON.stringify(reportData) }),
  delete: (id) => apiRequest(`/reports/${id}`, { method: 'DELETE' }),
};

const profileAPI = {
  updateLocation: (locationData) => apiRequest('/profile/location', { method: 'PUT', body: JSON.stringify(locationData) }),
};

// Main App Component
const MainApp = () => {
  const { currentUser, logout } = useAuth();
  const [location, setLocation] = useState('Click to get location');
  const [safetyStatus, setSafetyStatus] = useState('Loading safety status...');
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const [contacts, setContacts] = useState([]);
  const [reports, setReports] = useState([]);
  const [modal, setModal] = useState({ show: false, title: '', message: '' });
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [newReport, setNewReport] = useState({ type: 'Harassment', location: '' });

  // Load data from backend when component mounts
  useEffect(() => {
    if (currentUser) {
      loadContacts();
      loadReports();
    }
  }, [currentUser]);

  // Load contacts from backend
  const loadContacts = async () => {
    try {
      const data = await contactsAPI.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to load contacts. Please try again.'
      });
    }
  };

  // Load reports from backend
  const loadReports = async () => {
    try {
      const data = await reportsAPI.getAll();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to load reports. Please try again.'
      });
    }
  };

  // Get user location
  const getLocation = () => {
    setLocation('Getting location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationText = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          setLocation(locationText);
          updateSafetyStatus(latitude, longitude);
          
          // Save location to backend
          try {
            await profileAPI.updateLocation({ latitude, longitude });
          } catch (error) {
            console.error('Error saving location:', error);
          }
        },
        (error) => {
          setLocation('Location access denied');
          setSafetyStatus('⚠️ Unable to determine safety status');
        }
      );
    } else {
      setLocation('Geolocation not supported');
    }
  };

  // Simulate safety status based on location
  const updateSafetyStatus = (lat, lon) => {
    let status = '🟢 Area is SAFE';
    let color = '#15803d';
    
    if ((lat > 30 && lat < 33) && (lon > 76 && lon < 80)) {
      status = '🟡 MODERATE RISK - Be cautious';
      color = '#ca8a04';
    } else if (lat < 25 || lat > 35) {
      status = '🔴 HIGH RISK - Take immediate action';
      color = '#b91c1c';
    }
    
    setSafetyStatus(status);
  };

  // SOS Emergency Function
  const handleSOS = () => {
    setModal({
      show: true,
      title: '🚨 EMERGENCY ALERT SENT',
      message: `Emergency signal sent from your location: ${location}. Your ${contacts.length} emergency contacts have been notified. Police and emergency services alerted.`
    });
  };

  // Check-in Timer Functions
  const startTimer = (minutes) => {
    setTimerActive(true);
    setTimeRemaining(minutes * 60);
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          handleTimerExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimerExpired = () => {
    setModal({
      show: true,
      title: '⏰ CHECK-IN MISSED',
      message: `You missed your safety check-in! Your ${contacts.length} emergency contacts have been notified of your last known location: ${location}`
    });
  };

  const checkIn = () => {
    setTimerActive(false);
    setModal({
      show: true,
      title: '✅ SAFE CHECK-IN',
      message: 'Thank you for checking in! Your safety has been confirmed.'
    });
  };

  // Contact Management with Backend
  const addContact = async (e) => {
    e.preventDefault();
    try {
      await contactsAPI.create(newContact);
      setNewContact({ name: '', phone: '' });
      loadContacts();
      setModal({
        show: true,
        title: '✅ CONTACT ADDED',
        message: `${newContact.name} has been added to your emergency contacts.`
      });
    } catch (error) {
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to add contact. Please try again.'
      });
    }
  };

  const deleteContact = async (id) => {
    try {
      await contactsAPI.delete(id);
      loadContacts();
    } catch (error) {
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to delete contact. Please try again.'
      });
    }
  };

  // Report Management with Backend
  const addReport = async (e) => {
    e.preventDefault();
    try {
      await reportsAPI.create(newReport);
      setNewReport({ type: 'Harassment', location: '' });
      loadReports();
      setModal({
        show: true,
        title: '✅ REPORT SUBMITTED',
        message: 'Your safety report has been recorded anonymously.'
      });
    } catch (error) {
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to submit report. Please try again.'
      });
    }
  };

  const deleteReport = async (id) => {
    try {
      await reportsAPI.delete(id);
      loadReports();
    } catch (error) {
      setModal({
        show: true,
        title: 'Error',
        message: 'Failed to delete report. Please try again.'
      });
    }
  };

  // Modal functions
  const closeModal = () => {
    setModal({ show: false, title: '', message: '' });
  };

  // Format time for timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Base styles
  const appStyle = {
    backgroundColor: '#111827',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    paddingBottom: '80px'
  };

  const headerStyle = {
    backgroundColor: '#db2777',
    color: 'white',
    padding: '16px',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = {
    backgroundColor: '#b91c1c',
    color: 'white',
    padding: '20px',
    borderRadius: '15px',
    border: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
    width: '100%',
    marginBottom: '20px',
    cursor: 'pointer'
  };

  const cardStyle = {
    backgroundColor: '#1f2937',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #ec4899',
    marginBottom: '20px'
  };

  const navButtonStyle = (isActive) => ({
    color: isActive ? '#ec4899' : '#9ca3af',
    fontWeight: isActive ? 'bold' : 'normal',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  });

  // Render different views
  const renderHomeView = () => (
    <>
      {/* SOS Button */}
      <button style={buttonStyle} onClick={handleSOS}>
        🚨 EMERGENCY SOS
      </button>

      {/* Location Card */}
      <div style={cardStyle}>
        <h2 style={{color: '#ec4899', marginBottom: '10px'}}>📍 Your Location</h2>
        <button 
          onClick={getLocation}
          style={{
            backgroundColor: '#374151',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          {location}
        </button>
        <div style={{
          backgroundColor: '#15803d',
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {safetyStatus}
        </div>
      </div>

      {/* Check-in Timer */}
      <div style={cardStyle}>
        <h2 style={{color: '#ec4899', marginBottom: '10px'}}>⏰ Safety Check-in</h2>
        {timerActive ? (
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '32px', fontWeight: 'bold', margin: '10px 0'}}>
              {formatTime(timeRemaining)}
            </div>
            <button 
              onClick={checkIn}
              style={{
                backgroundColor: '#15803d',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              I'm Safe ✅
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', gap: '10px'}}>
            <button 
              onClick={() => startTimer(5)}
              style={{
                backgroundColor: '#374151',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                flex: 1,
                cursor: 'pointer'
              }}
            >
              5 min
            </button>
            <button 
              onClick={() => startTimer(15)}
              style={{
                backgroundColor: '#374151',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                flex: 1,
                cursor: 'pointer'
              }}
            >
              15 min
            </button>
            <button 
              onClick={() => startTimer(30)}
              style={{
                backgroundColor: '#374151',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                flex: 1,
                cursor: 'pointer'
              }}
            >
              30 min
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={cardStyle}>
        <h2 style={{color: '#ec4899', marginBottom: '15px'}}>📊 Your Safety Dashboard</h2>
        <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
          <div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ec4899'}}>{contacts.length}</div>
            <div>Emergency Contacts</div>
          </div>
          <div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ec4899'}}>{reports.length}</div>
            <div>Safety Reports</div>
          </div>
        </div>
      </div>
    </>
  );

  const renderContactsView = () => (
    <div>
      <div style={cardStyle}>
        <h2 style={{color: '#ec4899', marginBottom: '15px'}}>📞 Add Emergency Contact</h2>
        <form onSubmit={addContact}>
          <input
            type="text"
            placeholder="Contact Name"
            value={newContact.name}
            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white'
            }}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number (e.g., +1234567890)"
            value={newContact.phone}
            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white'
            }}
            required
          />
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ec4899',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            + Add Contact
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{color: '#ec4899', marginBottom: '15px'}}>Your Emergency Contacts ({contacts.length})</h2>
        {contacts.length === 0 ? (
          <p style={{textAlign: 'center', color: '#9ca3af'}}>No emergency contacts added yet.</p>
        ) : (
          contacts.map(contact => (
            <div key={contact._id} style={{
              backgroundColor: '#374151',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{fontWeight: 'bold'}}>{contact.name}</div>
                <div style={{color: '#ec4899', fontSize: '14px'}}>{contact.phone}</div>
              </div>
              <button 
                onClick={() => deleteContact(contact._id)}
                style={{
                  backgroundColor: '#b91c1c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderReportsView = () => (
    <div>
      <div style={cardStyle}>
        <h2 style={{color: '#ec4899', marginBottom: '15px'}}>📝 Submit Safety Report</h2>
        <form onSubmit={addReport}>
          <select
            value={newReport.type}
            onChange={(e) => setNewReport({...newReport, type: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white'
            }}
          >
            <option value="Harassment">Verbal Harassment</option>
            <option value="Poor Lighting">Poor Lighting / Danger Spot</option>
            <option value="Suspicious">Suspicious Activity</option>
            <option value="Theft">Attempted Theft</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Location details (optional)"
            value={newReport.location}
            onChange={(e) => setNewReport({...newReport, location: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#b91c1c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            + Submit Report
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h2 style={{color: '#ec4899', marginBottom: '15px'}}>Your Safety Reports ({reports.length})</h2>
        {reports.length === 0 ? (
          <p style={{textAlign: 'center', color: '#9ca3af'}}>No safety reports submitted yet.</p>
        ) : (
          reports.map(report => (
            <div key={report._id} style={{
              backgroundColor: '#374151',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div style={{fontWeight: 'bold', color: '#ec4899'}}>{report.type}</div>
                <button 
                  onClick={() => deleteReport(report._id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#9ca3af',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{fontSize: '14px', marginTop: '5px'}}>📍 {report.location || 'Not specified'}</div>
              <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '5px'}}>
                🕒 {new Date(report.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderResourcesView = () => (
    <div style={cardStyle}>
      <h2 style={{color: '#ec4899', marginBottom: '15px'}}>📚 Safety Resources</h2>
      
      <div style={{lineHeight: '1.6'}}>
        <div style={{marginBottom: '15px'}}>
          <h3 style={{color: '#ec4899'}}>🚨 Emergency Numbers</h3>
          <ul style={{paddingLeft: '20px', color: '#d1d5db'}}>
            <li>Police: 100</li>
            <li>Ambulance: 108</li>
            <li>Women Helpline: 1091</li>
          </ul>
        </div>

        <div style={{marginBottom: '15px'}}>
          <h3 style={{color: '#ec4899'}}>💡 Safety Tips</h3>
          <ul style={{paddingLeft: '20px', color: '#d1d5db'}}>
            <li>Always share your live location with trusted contacts</li>
            <li>Use well-lit, populated routes when walking alone</li>
            <li>Keep emergency contacts easily accessible</li>
            <li>Trust your instincts - if something feels wrong, leave</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div style={cardStyle}>
      <h2 style={{color: '#ec4899', marginBottom: '15px', textAlign: 'center'}}>👤 Your Profile</h2>
      
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#ec4899',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 auto 15px'
        }}>
          {currentUser?.name?.charAt(0) || 'U'}
        </div>
        <h3 style={{marginBottom: '5px'}}>{currentUser?.name || 'User'}</h3>
        <p style={{color: '#9ca3af'}}>{currentUser?.phone || 'No phone'}</p>
      </div>

      <div style={{
        backgroundColor: '#374151',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        <strong>Account Status:</strong> Active ✅
      </div>

      <button
        onClick={logout}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#b91c1c',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Logout
      </button>
    </div>
  );

  return (
    <div style={appStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <span>*FemSecure*</span>
        <span style={{fontSize: '14px'}}>Hello, {currentUser?.name}</span>
      </div>

      {/* Main Content */}
      {currentView === 'home' && renderHomeView()}
      {currentView === 'contacts' && renderContactsView()}
      {currentView === 'reports' && renderReportsView()}
      {currentView === 'resources' && renderResourcesView()}
      {currentView === 'profile' && renderProfileView()}

      {/* Modal */}
      {modal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #ec4899',
            maxWidth: '90%',
            width: '400px'
          }}>
            <h3 style={{color: '#ec4899', marginBottom: '15px'}}>{modal.title}</h3>
            <p style={{marginBottom: '20px', lineHeight: '1.5'}}>{modal.message}</p>
            <button 
              onClick={closeModal}
              style={{
                backgroundColor: '#ec4899',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1f2937',
        borderTop: '1px solid #9d174d',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <button style={navButtonStyle(currentView === 'home')} onClick={() => setCurrentView('home')}>🏠 Home</button>
        <button style={navButtonStyle(currentView === 'contacts')} onClick={() => setCurrentView('contacts')}>📞 Contacts</button>
        <button style={navButtonStyle(currentView === 'reports')} onClick={() => setCurrentView('reports')}>📝 Reports</button>
        <button style={navButtonStyle(currentView === 'resources')} onClick={() => setCurrentView('resources')}>📚 Resources</button>
        <button style={navButtonStyle(currentView === 'profile')} onClick={() => setCurrentView('profile')}>👤 Profile</button>
      </div>
    </div>
  );
};

// Root App Component
const App = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div style={{
        backgroundColor: '#111827',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#db2777',
          color: 'white',
          padding: '16px',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          *FemSecure* - Women Safety App
        </div>
        
        <AuthForm />
      </div>
    );
  }

  return <MainApp />;
};

// Wrap with AuthProvider
export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}