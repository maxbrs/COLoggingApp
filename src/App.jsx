import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import LoginForm from './components/LoginForm';
import IdentificationForm from './components/IdentificationForm';
import MainApplication from './components/MainApplication';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [identificationData, setIdentificationData] = useState(null);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading application...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (!identificationData) {
    return (
      <IdentificationForm 
        onComplete={setIdentificationData}
      />
    );
  }

  return (
    <AppProvider>
      <AppContentWithIdentification identificationData={identificationData} />
    </AppProvider>
  );
};

const AppContentWithIdentification = ({ identificationData }) => {
  const { setIdentification } = useApp();
  
  useEffect(() => {
    setIdentification(identificationData);
  }, [identificationData, setIdentification]);

  return <MainApplication />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 