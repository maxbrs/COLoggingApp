import React, { useState, useEffect } from 'react';
import { useIdentificationConfig } from '../hooks/useIdentificationConfig';
import { ArrowRight, Clock, Building, User, FolderOpen } from 'lucide-react';

const IdentificationForm = ({ onComplete }) => {
  const { config, loading, getUniqueValues, saveIdentification, getCurrentIdentification } = useIdentificationConfig();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});

  useEffect(() => {
    // Load current identification if available
    const current = getCurrentIdentification();
    if (current) {
      setFormData(current);
    }
  }, []);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }

    // Hide suggestions when user starts typing
    setShowSuggestions(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  const handleSuggestionClick = (fieldName, value) => {
    handleInputChange(fieldName, value);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!config) return newErrors;

    config.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save identification data
    saveIdentification(formData);
    
    // Complete identification step
    onComplete(formData);
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const suggestions = field.savePrevious ? getUniqueValues(field.name) : [];
    const showFieldSuggestions = showSuggestions[field.name] && suggestions.length > 0;

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onFocus={() => setShowSuggestions(prev => ({ ...prev, [field.name]: true }))}
                className="form-input"
                placeholder={field.placeholder}
                required={field.required}
              />
              {showFieldSuggestions && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 10,
                  maxHeight: '150px',
                  overflowY: 'auto'
                }}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(field.name, suggestion)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                      <Clock size={14} color="#666" />
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && <div className="form-error">{error}</div>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <select
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="form-input"
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <div className="form-error">{error}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading identification form...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="card">
        <h2>Configuration Error</h2>
        <p>Failed to load identification form configuration.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px', maxWidth: '600px' }}>
      <div className="card">
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
            <Building size={40} color="white" />
          </div>
          <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>{config.title}</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{config.description}</p>
          
          {getUniqueValues('company').length > 0 && (
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Clock size={16} color="#667eea" />
              <span>Click on text fields to see previous entries</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {config.fields.slice(0, 4).map(renderField)}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {config.fields.slice(4).map(renderField)}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            paddingTop: '1rem',
            borderTop: '1px solid #eee'
          }}>
            <button type="submit" className="btn">
              <ArrowRight size={16} />
              Continue to Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdentificationForm; 