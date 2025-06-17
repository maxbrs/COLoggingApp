import React, { useState, useEffect } from 'react';
import { useFormConfig } from '../hooks/useFormConfig';
import { Save, Calculator, CheckCircle, AlertCircle } from 'lucide-react';

const DynamicForm = () => {
  const { config, loading, calculateCarbonFootprint } = useFormConfig();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [carbonFootprint, setCarbonFootprint] = useState(null);

  useEffect(() => {
    // Load saved submissions from localStorage
    const saved = localStorage.getItem('co-logging-submissions');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved submissions:', error);
      }
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

    // Hide results when form changes
    setShowResults(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!config) return newErrors;

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }

        // Check conditional fields
        if (field.conditionalShow) {
          const { field: conditionField, values } = field.conditionalShow;
          const shouldShow = values.includes(formData[conditionField]);
          if (shouldShow && field.required && !formData[field.name]) {
            newErrors[field.name] = `${field.label} is required`;
          }
        }

        // Validate number fields
        if (field.type === 'number' && formData[field.name]) {
          const value = parseFloat(formData[field.name]);
          if (isNaN(value)) {
            newErrors[field.name] = `${field.label} must be a valid number`;
          } else {
            if (field.min !== undefined && value < field.min) {
              newErrors[field.name] = `${field.label} must be at least ${field.min}`;
            }
            if (field.max !== undefined && value > field.max) {
              newErrors[field.name] = `${field.label} must be at most ${field.max}`;
            }
          }
        }
      });
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

    // Calculate carbon footprint
    const footprint = calculateCarbonFootprint(formData);
    setCarbonFootprint(footprint);

    // Save submission
    const submission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: { ...formData },
      carbonFootprint: footprint
    };

    const updatedSubmissions = [submission, ...submissions];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('co-logging-submissions', JSON.stringify(updatedSubmissions));

    setShowResults(true);
    
    // Reset form
    setFormData({});
    setErrors({});
  };

  const renderField = (field) => {
    // Check if field should be shown based on conditional logic
    if (field.conditionalShow) {
      const { field: conditionField, values } = field.conditionalShow;
      const shouldShow = values.includes(formData[conditionField]);
      if (!shouldShow) return null;
    }

    const value = formData[field.name] || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="form-input"
              placeholder={field.placeholder}
              required={field.required}
            />
            {error && <div className="form-error">{error}</div>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="form-input"
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              required={field.required}
            />
            {error && <div className="form-error">{error}</div>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="form-input"
              required={field.required}
            />
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

      case 'textarea':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="form-input"
              placeholder={field.placeholder}
              rows={field.rows || 4}
              required={field.required}
            />
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
        <p>Loading form configuration...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="card">
        <AlertCircle size={48} color="#e74c3c" />
        <h2>Configuration Error</h2>
        <p>Failed to load form configuration. Please check the YAML file.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div className="card">
        <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>{config.title}</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>{config.description}</p>

        {showResults && carbonFootprint && (
          <div style={{
            background: 'linear-gradient(135deg, #00c851 0%, #007e33 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <CheckCircle size={32} />
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Entry Saved Successfully!</h3>
              <p style={{ margin: 0 }}>
                Estimated CO₂ emissions: <strong>{carbonFootprint.totalEmissions} kg</strong>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {config.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                color: '#667eea', 
                borderBottom: '2px solid #667eea', 
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}>
                {section.name}
              </h2>
              {section.description && (
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                  {section.description}
                </p>
              )}
              {section.fields.map(renderField)}
            </div>
          ))}

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #eee'
          }}>
            <button type="submit" className="btn">
              <Save size={16} />
              Save Entry
            </button>
          </div>
        </form>
      </div>

      {submissions.length > 0 && (
        <div className="card">
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>Recent Submissions</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {submissions.slice(0, 5).map(submission => (
              <div key={submission.id} style={{
                padding: '1rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginBottom: '1rem',
                background: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{submission.data.equipmentType} - {submission.data.equipmentModel}</strong>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {new Date(submission.timestamp).toLocaleString()}
                  </span>
                </div>
                {submission.carbonFootprint && (
                  <div style={{ marginTop: '0.5rem', color: '#667eea' }}>
                    <Calculator size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    CO₂ emissions: {submission.carbonFootprint.totalEmissions} kg
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicForm; 