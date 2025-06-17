import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

export const useIdentificationConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousSubmissions, setPreviousSubmissions] = useState([]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/identification-config.yaml');
        const yamlText = await response.text();
        const parsedConfig = yaml.load(yamlText);
        setConfig(parsedConfig);
      } catch (err) {
        console.warn('Failed to load identification config, using fallback:', err);
        setConfig(getFallbackConfig());
      } finally {
        setLoading(false);
      }
    };

    const loadPreviousSubmissions = () => {
      const saved = localStorage.getItem('co-logging-identification-history');
      if (saved) {
        try {
          setPreviousSubmissions(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to load previous submissions:', error);
        }
      }
    };

    loadConfig();
    loadPreviousSubmissions();
  }, []);

  const saveIdentification = (data) => {
    // Save current identification
    localStorage.setItem('co-logging-current-identification', JSON.stringify(data));

    // Add to history for future reference
    const updatedHistory = [...previousSubmissions];
    
    // Check if this combination already exists
    const existingIndex = updatedHistory.findIndex(item => 
      item.company === data.company && 
      item.project === data.project &&
      item.reporter === data.reporter
    );

    if (existingIndex >= 0) {
      // Update existing entry
      updatedHistory[existingIndex] = { ...data, lastUsed: new Date().toISOString() };
    } else {
      // Add new entry
      updatedHistory.unshift({ ...data, lastUsed: new Date().toISOString() });
    }

    // Keep only last 10 submissions
    const trimmedHistory = updatedHistory.slice(0, 10);
    setPreviousSubmissions(trimmedHistory);
    localStorage.setItem('co-logging-identification-history', JSON.stringify(trimmedHistory));
  };

  const getCurrentIdentification = () => {
    const saved = localStorage.getItem('co-logging-current-identification');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load current identification:', error);
      }
    }
    return null;
  };

  const getUniqueValues = (fieldName) => {
    const values = previousSubmissions
      .map(submission => submission[fieldName])
      .filter(value => value && value.trim())
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();
    
    return values;
  };

  return {
    config,
    loading,
    error,
    previousSubmissions,
    saveIdentification,
    getCurrentIdentification,
    getUniqueValues
  };
};

// Fallback configuration
const getFallbackConfig = () => ({
  title: "Project Identification",
  description: "Please provide the following information to identify your project and reporting period",
  fields: [
    {
      name: "company",
      label: "Company Name",
      type: "text",
      required: true,
      placeholder: "Enter your company name",
      savePrevious: true
    },
    {
      name: "reporter",
      label: "Reporter Name",
      type: "text",
      required: true,
      placeholder: "Enter reporter's full name",
      savePrevious: true
    },
    {
      name: "project",
      label: "Project Name",
      type: "text",
      required: true,
      placeholder: "Enter project name or identifier",
      savePrevious: true
    },
    {
      name: "reportingMonth",
      label: "Reporting Month",
      type: "select",
      required: true,
      options: [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" }
      ]
    },
    {
      name: "reportingYear",
      label: "Reporting Year",
      type: "select",
      required: true,
      options: [
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2025", label: "2025" }
      ]
    }
  ]
}); 