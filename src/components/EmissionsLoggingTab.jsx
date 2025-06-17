import React, { useState, useEffect } from 'react';
import { useFormConfig } from '../hooks/useFormConfig';
import { useApp } from '../context/AppContext';
import { Save, Plus, Edit, Trash2, Calculator, AlertCircle, CheckCircle, X, Copy } from 'lucide-react';

const EmissionsLoggingTab = () => {
  const { config, loading, calculateCarbonFootprint } = useFormConfig();
  const { 
    entries, 
    editingEntry, 
    addEntry, 
    updateEntry, 
    deleteEntry, 
    startEditingEntry, 
    duplicateEntry,
    cancelEditing,
    identification 
  } = useApp();
  
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [previewResults, setPreviewResults] = useState(null);

  useEffect(() => {
    if (editingEntry) {
      setFormData(editingEntry.data);
      setPreviewResults(editingEntry.carbonFootprint);
    } else {
      setFormData({});
      setPreviewResults(null);
    }
    setErrors({});
  }, [editingEntry]);

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

    // Update preview when key fields change
    const updatedData = { ...formData, [fieldName]: value };
    if (updatedData.fuelType && (updatedData.fuelConsumption || updatedData.electricityConsumption) && updatedData.operationHours) {
      try {
        const footprint = calculateCarbonFootprint(updatedData);
        setPreviewResults(footprint);
      } catch (error) {
        console.warn('Error calculating carbon footprint preview:', error);
        setPreviewResults(null);
      }
    } else {
      setPreviewResults(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!config) return newErrors;

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        // Check if field should be shown based on conditional logic
        let shouldShow = true;
        if (field.conditionalShow) {
          const { field: conditionField, values } = field.conditionalShow;
          shouldShow = values.includes(formData[conditionField]);
        }

        // Only validate fields that should be shown
        if (shouldShow) {
          if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
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
      console.log('Validation errors:', newErrors);
      console.log('Current form data:', formData);
      setErrors(newErrors);
      return;
    }

    // Calculate carbon footprint
    const footprint = calculateCarbonFootprint(formData);
    console.log('Calculated footprint:', footprint);

    if (editingEntry && editingEntry.id) {
      updateEntry(editingEntry.id, formData, footprint);
      console.log('Entry updated successfully');
    } else {
      addEntry(formData, footprint);
      console.log('Entry added successfully');
    }

    // Reset form
    setFormData({});
    setErrors({});
    setPreviewResults(null);
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entryId);
    }
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
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="loading">
          <div className="spinner" />
          <p>Loading form configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="card">
          <AlertCircle size={48} color="#e74c3c" />
          <h2>Configuration Error</h2>
          <p>Failed to load form configuration. Please check the YAML file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      {/* Current session info */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#333' }}>Current Session</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              {identification?.company} - {identification?.project} - {identification?.reportingMonth}/{identification?.reportingYear}
            </p>
          </div>
          <div style={{ 
            background: 'rgba(102, 126, 234, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px',
            color: '#667eea',
            fontWeight: '600'
          }}>
            {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* Form Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ color: '#333', margin: 0 }}>
                {editingEntry?.isDuplicate ? 'Duplicate Entry' : editingEntry ? 'Edit Entry' : 'Add New Entry'}
              </h1>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
                {editingEntry?.isDuplicate ? 'Modify the duplicated entry and save as new' : 
                 editingEntry ? 'Modify the existing equipment entry' : 'Log equipment usage and carbon emissions'}
              </p>
            </div>
            {editingEntry && (
              <button 
                onClick={cancelEditing}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                <X size={16} />
                {editingEntry.isDuplicate ? 'Cancel Duplicate' : 'Cancel Edit'}
              </button>
            )}
          </div>

          {previewResults && (
            <div style={{
              background: 'linear-gradient(135deg, #00c851 0%, #007e33 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Calculator size={24} />
              <div>
                <strong>Estimated CO₂ Emissions: {previewResults.totalEmissions} kg</strong>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Based on current form inputs
                </div>
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
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {section.fields.map(renderField)}
                </div>
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
               {editingEntry?.isDuplicate ? 'Save as New Entry' : editingEntry ? 'Update Entry' : 'Add Entry'}
             </button>
            </div>
          </form>
        </div>

        {/* Entries List Section */}
        <div className="card">
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>Current Entries</h2>
          
          {entries.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#666'
            }}>
              <Plus size={48} style={{ opacity: 0.3 }} />
              <p>No entries yet. Add your first equipment entry using the form.</p>
            </div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {entries.map(entry => (
                <div key={entry.id} style={{
                  padding: '1rem',
                  border: editingEntry?.id === entry.id ? '2px solid #667eea' : '1px solid #eee',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  background: editingEntry?.id === entry.id ? 'rgba(102, 126, 234, 0.05)' : '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#333' }}>
                          {entry.data.equipmentType || 'Unknown'} - {entry.data.equipmentModel || 'N/A'}
                        </strong>
                        {editingEntry?.id === entry.id && (
                          <span style={{
                            background: '#667eea',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem'
                          }}>
                            EDITING
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                        {entry.data.operationDate} • {entry.data.operationHours}h • {entry.data.fuelType}
                      </div>
                      {entry.carbonFootprint && (
                        <div style={{ color: '#667eea', fontWeight: '600' }}>
                          <Calculator size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          {entry.carbonFootprint.totalEmissions} kg CO₂
                        </div>
                      )}
                    </div>
                                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <button
                         onClick={() => startEditingEntry(entry.id)}
                         className="btn btn-secondary"
                         style={{ padding: '0.5rem', minWidth: 'auto' }}
                         title="Edit entry"
                       >
                         <Edit size={14} />
                       </button>
                       <button
                         onClick={() => duplicateEntry(entry.id)}
                         className="btn btn-secondary"
                         style={{ padding: '0.5rem', minWidth: 'auto', background: 'rgba(0, 200, 81, 0.1)', borderColor: 'rgba(0, 200, 81, 0.3)' }}
                         title="Duplicate entry"
                       >
                         <Copy size={14} color="#00c851" />
                       </button>
                       <button
                         onClick={() => handleDeleteEntry(entry.id)}
                         className="btn btn-danger"
                         style={{ padding: '0.5rem', minWidth: 'auto' }}
                         title="Delete entry"
                       >
                         <Trash2 size={14} />
                       </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmissionsLoggingTab; 