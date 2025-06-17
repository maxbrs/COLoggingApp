import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import Header from './Header';
import TabNavigation from './TabNavigation';
import InstructionsTab from './InstructionsTab';
import EmissionsLoggingTab from './EmissionsLoggingTab';
import OverviewTab from './OverviewTab';

const MainApplication = () => {
  const { activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'instructions':
        return <InstructionsTab />;
      case 'logging':
        return <EmissionsLoggingTab />;
      case 'overview':
        return <OverviewTab />;
      default:
        return <InstructionsTab />;
    }
  };

  return (
    <>
      <Header />
      <TabNavigation />
      <main style={{ flex: 1, paddingBottom: '2rem' }}>
        {renderActiveTab()}
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
};

export default MainApplication; 