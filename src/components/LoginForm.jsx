import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, LogIn } from 'lucide-react';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials.username, credentials.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Lock size={40} color="white" />
          </div>
          <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>
            CO Logging App
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Carbon Footprint Equipment Logger
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" style={{ 
                width: '20px', 
                height: '20px', 
                borderWidth: '2px',
                margin: '0'
              }} />
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>Demo Credentials:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            <div>👤 <strong>admin</strong> / admin123</div>
            <div>👷 <strong>operator</strong> / op123</div>
            <div>👔 <strong>manager</strong> / mgr123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 