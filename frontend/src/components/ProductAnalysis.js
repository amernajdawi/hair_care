import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'rgba(247, 216, 216, 0.7)',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(247, 216, 216, 0.4)',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#8B7E7E',
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'linear-gradient(to bottom, #F7D8D8 0%, #FBE6E6 100%)',
    color: '#8B7E7E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(232, 180, 184, 0.3)',
  },
  hairType: {
    marginBottom: '16px',
    color: '#8B7E7E',
  },
  analysis: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'linear-gradient(135deg, #FBE6E6 0%, #FFF0F0 100%)',
    borderRadius: '4px',
    border: '1px solid #F7D8D8',
    color: '#8B7E7E',
    boxShadow: '0 3px 6px rgba(255, 182, 193, 0.2)',
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#8B7E7E',
    marginBottom: '8px',
    borderBottom: '2px solid #F7D8D8',
    paddingBottom: '4px',
  },
  analysisContent: {
    marginBottom: '16px',
    lineHeight: '1.6',
  },
  loadingText: {
    fontSize: '14px',
    color: '#8B7E7E',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: '10px 0',
    animation: 'pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.6 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.6 },
  },
};

function ProductAnalysis({ selectedHairType, selectedPorosity }) {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeProduct = useCallback(async (uploadedFile) => {
    if (!uploadedFile) {
      alert("Please select a file first.");
      return;
    }
    if (!selectedHairType) {
      alert("Please select your hair type.");
      return;
    }
    if (!selectedPorosity) {
      alert("Please select your hair porosity in the Hair Advice section.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', uploadedFile);
    formData.append('hairType', selectedHairType);
    formData.append('porosity', selectedPorosity);
    formData.append('language', 'en');

    try {
      const response = await axios.post(`${API_URL}/api/product-analysis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        alert("Received unexpected response from server.");
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
      alert('An error occurred while analyzing the product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedHairType, selectedPorosity]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    analyzeProduct(uploadedFile);
  };

  const renderAnalysis = useCallback(() => {
    if (!analysis) return null;
    
    const cleanAnalysis = analysis.replace(/[#*]/g, '').trim();
    const sections = cleanAnalysis.split('\n\n').filter(section => section.trim() !== '');
    
    return (
      <div style={styles.analysis}>
        {sections.map((section, index) => {
          const [heading, ...content] = section.split(':');
          return (
            <div key={index}>
              <h3 style={styles.sectionHeading}>{heading.trim()}</h3>
              <div style={styles.analysisContent}>
                {content.join(':').split('\n').map((line, lineIndex) => (
                  <p key={lineIndex}>{line.trim()}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [analysis]);

  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`Component render time: ${endTime - startTime}ms`);
    };
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Product Analysis</h2>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div style={styles.hairType}>Selected Hair Type: {selectedHairType}</div>
      <div style={styles.hairType}>Selected Porosity: {selectedPorosity}</div>
      {isLoading && (
        <div style={styles.loadingText}>Please wait... Analyzing your product ✨</div>
      )}
      {!isLoading && renderAnalysis()}
    </div>
  );
}

export default React.memo(ProductAnalysis);