import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, AlertCircle } from 'lucide-react';

const InstructionsTab = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const response = await fetch('/instructions.md');
        const markdownText = await response.text();
        setContent(markdownText);
      } catch (err) {
        console.error('Failed to load instructions:', err);
        setError('Failed to load instructions');
        setContent(getFallbackInstructions());
      } finally {
        setLoading(false);
      }
    };

    loadInstructions();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="loading">
          <div className="spinner" />
          <p>Loading instructions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div className="card">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #667eea'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={30} color="white" />
          </div>
          <div>
            <h1 style={{ color: '#333', margin: 0 }}>Instructions</h1>
            <p style={{ color: '#666', margin: 0 }}>
              Please read these instructions carefully before logging equipment data
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div style={{
          lineHeight: '1.6',
          color: '#444'
        }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 style={{ 
                  color: '#667eea', 
                  borderBottom: '2px solid #667eea', 
                  paddingBottom: '0.5rem',
                  marginTop: '2rem',
                  marginBottom: '1rem'
                }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ 
                  color: '#667eea', 
                  marginTop: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 style={{ 
                  color: '#555', 
                  marginTop: '1.25rem',
                  marginBottom: '0.75rem'
                }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ marginBottom: '1rem' }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul style={{ 
                  marginBottom: '1rem',
                  paddingLeft: '1.5rem'
                }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{ 
                  marginBottom: '1rem',
                  paddingLeft: '1.5rem'
                }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '0.5rem' }}>
                  {children}
                </li>
              ),
              code: ({ children, inline }) => (
                <code style={{
                  background: inline ? 'rgba(102, 126, 234, 0.1)' : '#f5f5f5',
                  padding: inline ? '2px 4px' : '1rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                  display: inline ? 'inline' : 'block',
                  margin: inline ? '0' : '1rem 0'
                }}>
                  {children}
                </code>
              ),
              blockquote: ({ children }) => (
                <blockquote style={{
                  borderLeft: '4px solid #667eea',
                  paddingLeft: '1rem',
                  margin: '1rem 0',
                  background: 'rgba(102, 126, 234, 0.05)',
                  padding: '1rem',
                  borderRadius: '0 8px 8px 0'
                }}>
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong style={{ color: '#667eea' }}>
                  {children}
                </strong>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const getFallbackInstructions = () => `
# Equipment Carbon Footprint Logging Instructions

## Welcome to the CO Logging System

This system helps you track and calculate the carbon footprint of various machinery and equipment used in your projects.

## Before You Start

### Gather Required Information

- **Equipment details**: Model, brand, and serial numbers
- **Fuel consumption data**: Actual fuel used or estimated consumption
- **Operation logs**: Hours of operation for each piece of equipment

### Understanding Calculations

The system calculates CO₂ emissions using:
\`\`\`
Total Emissions = Fuel Consumption × Emission Factor × Condition Multiplier × Operating Hours
\`\`\`

## Best Practices

- ✅ Use actual fuel receipts when possible
- ✅ Record daily rather than trying to remember weekly
- ✅ Include all equipment even if used for short periods
- ❌ Don't include idle time in operating hours
- ❌ Don't estimate when actual data is available

## Support

If you encounter issues, check your data inputs and consult with your project manager.
`;

export default InstructionsTab; 