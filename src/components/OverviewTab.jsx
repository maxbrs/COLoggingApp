import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Edit, 
  Trash2, 
  Calculator, 
  Calendar, 
  Clock, 
  Fuel, 
  AlertTriangle,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

const OverviewTab = () => {
  const { 
    entries, 
    identification, 
    isSubmitting,
    startEditingEntry, 
    deleteEntry, 
    submitAllEntries,
    clearAllEntries 
  } = useApp();

  const totalEmissions = entries.reduce((sum, entry) => 
    sum + (entry.carbonFootprint?.totalEmissions || 0), 0
  );

  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entryId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all entries? This action cannot be undone.')) {
      clearAllEntries();
    }
  };

  if (entries.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <AlertTriangle size={64} color="#f39c12" style={{ opacity: 0.5 }} />
            <h2 style={{ color: '#333', marginTop: '1rem' }}>No Entries to Review</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              You need to add at least one equipment entry before you can review and submit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      {/* Summary Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ color: '#333', margin: 0 }}>Submission Overview</h1>
            <p style={{ color: '#666', margin: '0.5rem 0' }}>
              Review your entries before final submission
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              marginBottom: '0.5rem'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {totalEmissions.toFixed(2)} kg CO₂
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Total Emissions
              </div>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Project Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Company:</strong> {identification?.company}
            </div>
            <div>
              <strong>Project:</strong> {identification?.project}
            </div>
            <div>
              <strong>Reporter:</strong> {identification?.reporter}
            </div>
            <div>
              <strong>Period:</strong> {identification?.reportingMonth}/{identification?.reportingYear}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleClearAll}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            <RotateCcw size={16} />
            Clear All
          </button>
          <button 
            onClick={submitAllEntries}
            className="btn"
            disabled={isSubmitting}
            style={{ 
              background: isSubmitting 
                ? '#ccc' 
                : 'linear-gradient(135deg, #00c851 0%, #007e33 100%)',
              minWidth: '180px'
            }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderWidth: '2px',
                  margin: '0'
                }} />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit All Entries
              </>
            )}
          </button>
        </div>
      </div>

      {/* Entries Table */}
      <div className="card">
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Equipment Entries</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  Equipment
                </th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  Date & Duration
                </th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  Fuel & Consumption
                </th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  CO₂ Emissions
                </th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  borderBottom: '2px solid #dee2e6',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} style={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}>
                  <td style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'top'
                  }}>
                    <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                      {entry.data.equipmentType || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>
                      {entry.data.equipmentModel || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>
                      ID: {entry.data.equipmentId || 'N/A'}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'top'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Calendar size={14} color="#666" />
                      <span style={{ fontSize: '0.9rem' }}>{entry.data.operationDate || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="#666" />
                      <span style={{ fontSize: '0.9rem' }}>{entry.data.operationHours || 0}h</span>
                    </div>
                  </td>
                  <td style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'top'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Fuel size={14} color="#666" />
                      <span style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>
                        {entry.data.fuelType || 'N/A'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {entry.data.fuelConsumption ? `${entry.data.fuelConsumption}L` : 
                       entry.data.electricityConsumption ? `${entry.data.electricityConsumption}kWh` : 'N/A'}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    verticalAlign: 'top'
                  }}>
                    {entry.carbonFootprint ? (
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        <Calculator size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {entry.carbonFootprint.totalEmissions} kg
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    verticalAlign: 'top'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => startEditingEntry(entry.id)}
                        className="btn btn-secondary"
                        style={{ 
                          padding: '0.5rem', 
                          minWidth: 'auto',
                          fontSize: '0.8rem'
                        }}
                        title="Edit entry"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="btn btn-danger"
                        style={{ 
                          padding: '0.5rem', 
                          minWidth: 'auto',
                          fontSize: '0.8rem'
                        }}
                        title="Delete entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Row */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Total: {entries.length} equipment {entries.length === 1 ? 'entry' : 'entries'}</strong>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            <Calculator size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {totalEmissions.toFixed(2)} kg CO₂
          </div>
        </div>
      </div>

      {/* Submission Note */}
      <div className="card" style={{ 
        marginTop: '2rem',
        background: 'rgba(102, 126, 234, 0.05)',
        border: '1px solid rgba(102, 126, 234, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <CheckCircle size={24} color="#667eea" style={{ marginTop: '0.25rem' }} />
          <div>
            <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Ready to Submit</h3>
            <p style={{ color: '#d1d1d1', margin: 0, lineHeight: '1.5' }}>
              Once you submit these entries, they will be sent for processing and cannot be modified. 
              Please review all entries carefully before submitting. You can still edit or delete 
              entries using the action buttons in the table above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab; 