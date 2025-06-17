import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple mock users for demonstration
const MOCK_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
  { username: 'operator', password: 'op123', role: 'operator', name: 'Equipment Operator' },
  { username: 'manager', password: 'mgr123', role: 'manager', name: 'Site Manager' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on app start
    const storedUser = localStorage.getItem('co-logging-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('co-logging-user');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          u => u.username === username && u.password === password
        );
        
        if (foundUser) {
          const userSession = {
            username: foundUser.username,
            name: foundUser.name,
            role: foundUser.role,
            loginTime: new Date().toISOString()
          };
          setUser(userSession);
          localStorage.setItem('co-logging-user', JSON.stringify(userSession));
          resolve(userSession);
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 1000); // Simulate API call delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('co-logging-user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 