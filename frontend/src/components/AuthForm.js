import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

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

export default AuthForm;