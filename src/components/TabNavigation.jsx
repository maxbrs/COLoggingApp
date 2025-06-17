import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Clipboard, CheckSquare } from 'lucide-react';

const TabNavigation = () => {
  const { activeTab, setActiveTab, entries } = useApp();

  const tabs = [
    {
      id: 'instructions',
      label: 'Instructions',
      icon: BookOpen,
      description: 'How to fill the form'
    },
    {
      id: 'logging',
      label: 'Emissions Logging',
      icon: Clipboard,
      description: 'Record equipment usage',
      badge: entries.length > 0 ? entries.length : null
    },
    {
      id: 'overview',
      label: 'Overview & Submit',
      icon: CheckSquare,
      description: 'Review and submit entries',
      badge: entries.length > 0 ? entries.length : null,
      disabled: entries.length === 0
    }
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1rem 0',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderRadius: '12px',
          background: 'rgba(102, 126, 234, 0.1)',
          padding: '0.5rem'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled;

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: isActive 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  color: isActive ? 'white' : isDisabled ? '#999' : '#667eea',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  opacity: isDisabled ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled && !isActive) {
                    e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabled && !isActive) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {tab.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    opacity: 0.8,
                    marginTop: '0.25rem'
                  }}>
                    {tab.description}
                  </div>
                </div>
                
                {tab.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: isActive ? 'rgba(255,255,255,0.3)' : '#667eea',
                    color: isActive ? 'white' : 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {tab.badge}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation; 