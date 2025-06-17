import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { LogOut, User, Activity, Building, Edit } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { identification } = useApp();

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1rem 0',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={20} color="white" />
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              CO Logging App
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
              Carbon Footprint Equipment Logger
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {identification && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(0, 200, 81, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(0, 200, 81, 0.2)'
            }}>
              <Building size={16} color="#00c851" />
              <span style={{ color: '#00c851', fontWeight: '600', fontSize: '0.9rem' }}>
                {identification.company} - {identification.project}
              </span>
              <span style={{
                color: '#00c851',
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                {identification.reportingMonth}/{identification.reportingYear}
              </span>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '20px'
          }}>
            <User size={16} color="#667eea" />
            <span style={{ color: '#667eea', fontWeight: '600' }}>
              {user?.name}
            </span>
            <span style={{ 
              color: '#999', 
              fontSize: '0.8rem',
              padding: '0.2rem 0.5rem',
              background: 'rgba(102, 126, 234, 0.2)',
              borderRadius: '10px'
            }}>
              {user?.role}
            </span>
          </div>

          <button 
            onClick={logout}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 