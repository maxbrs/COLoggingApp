import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [identification, setIdentification] = useState(null);
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [activeTab, setActiveTab] = useState('instructions');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load saved entries on app start
    const saved = localStorage.getItem('co-logging-current-entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved entries:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save entries whenever they change
    localStorage.setItem('co-logging-current-entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entryData, carbonFootprint) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: { ...entryData },
      carbonFootprint,
      identification
    };

    setEntries(prev => [...prev, newEntry]);
    toast.success('Entry added successfully!');
    return newEntry;
  };

  const updateEntry = (entryId, entryData, carbonFootprint) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, data: { ...entryData }, carbonFootprint, timestamp: new Date().toISOString() }
        : entry
    ));
    setEditingEntry(null);
    toast.success('Entry updated successfully!\nDon\'t forget to submit your entries.');
  };

  const deleteEntry = (entryId) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    toast.success('Entry deleted successfully!');
  };

  const startEditingEntry = (entryId) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setActiveTab('logging');
    }
  };

  const duplicateEntry = (entryId) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      // Create a copy of the entry data for editing (without the original ID)
      const duplicatedData = { ...entry.data };
      setEditingEntry({ 
        id: null, // No ID means it's a new entry
        data: duplicatedData,
        carbonFootprint: entry.carbonFootprint,
        isDuplicate: true // Flag to indicate this is a duplicate
      });
      setActiveTab('logging');
      toast.success('Entry duplicated! You can now modify and save it as a new entry.');
    }
  };

  const cancelEditing = () => {
    setEditingEntry(null);
  };

  const submitAllEntries = async () => {
    if (entries.length === 0) {
      toast.error('No entries to submit');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success/failure for demonstration
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        // Save to submitted history
        const submissionData = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          identification,
          entries: [...entries],
          totalEmissions: entries.reduce((sum, entry) => 
            sum + (entry.carbonFootprint?.totalEmissions || 0), 0
          ),
          entryCount: entries.length
        };

        const submittedHistory = JSON.parse(
          localStorage.getItem('co-logging-submitted-history') || '[]'
        );
        submittedHistory.unshift(submissionData);
        localStorage.setItem('co-logging-submitted-history', JSON.stringify(submittedHistory));

        // Clear current entries
        setEntries([]);
        localStorage.removeItem('co-logging-current-entries');

        toast.success(
          `Successfully submitted ${entries.length} entries with total emissions of ${submissionData.totalEmissions.toFixed(2)} kg CO₂!`,
          { duration: 5000 }
        );

        // Reset to logging tab for next session
        setActiveTab('logging');
      } else {
        throw new Error('Submission failed due to server error');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Submission failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAllEntries = () => {
    setEntries([]);
    setEditingEntry(null);
    toast.success('All entries cleared');
  };

  const value = {
    identification,
    setIdentification,
    entries,
    editingEntry,
    activeTab,
    setActiveTab,
    isSubmitting,
    addEntry,
    updateEntry,
    deleteEntry,
    startEditingEntry,
    duplicateEntry,
    cancelEditing,
    submitAllEntries,
    clearAllEntries
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 