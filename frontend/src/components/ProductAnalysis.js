import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  container: {
    padding: '20px',
    backgroundImage: 'url("/images/wallpaper.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'rgba(247, 216, 216, 0.7)',
    backgroundBlendMode: 'overlay',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(247, 216, 216, 0.4)',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#8B7E7E', // Muted dark pink for text
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'linear-gradient(to bottom, #F7D8D8 0%, #FBE6E6 100%)', // Soft pastel pink gradient
    color: '#8B7E7E', // Muted dark pink for text
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(232, 180, 184, 0.3)',
  },
  hairType: {
    marginBottom: '16px',
    color: '#8B7E7E', // Muted dark pink for text
  },
  analysis: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'linear-gradient(135deg, #FBE6E6 0%, #FFF0F0 100%)', // Very light pastel pink gradient
    borderRadius: '4px',
    border: '1px solid #F7D8D8', // Soft pastel pink border
    color: '#8B7E7E', // Muted dark pink for text
    boxShadow: '0 3px 6px rgba(255, 182, 193, 0.2)',
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#8B7E7E', // Muted dark pink for text
    marginBottom: '8px',
    borderBottom: '2px solid #F7D8D8', // Soft pastel pink border
    paddingBottom: '4px',
  },
  analysisContent: {
    marginBottom: '16px',
    lineHeight: '1.6',
  },
  ingredientName: {
    fontWeight: 'bold',
    color: '#8B7E7E', // Muted dark pink for text
  },
  analysisLine: {
    padding: '8px 0',
    borderBottom: '1px solid #F7D8D8', // Soft pastel pink border
  },
  analysisLineIcon: {
    marginRight: '8px',
    color: '#8B7E7E', // Muted dark pink for text
  },
};

function ProductAnalysis({ selectedHairType, selectedPorosity }) {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    if (!selectedHairType) {
      alert("Please select a hair type.");
      return;
    }
    if (!selectedPorosity) {
      alert("Please select a porosity level in the Hair Advice section.");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('hairType', selectedHairType);
    formData.append('porosity', selectedPorosity);

    try {
      const response = await axios.post('http://localhost:8000/api/product-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        alert("Received an unexpected response from the server.");
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
      alert('An error occurred while analyzing the product. Please try again.');
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;
    
    const sections = analysis.split('\n\n').filter(section => section.trim() !== '');
    
    return (
      <div style={styles.analysis}>
        {sections.map((section, index) => {
          const [heading, ...content] = section.split(':');
          return (
            <div key={index}>
              <h3 style={styles.sectionHeading}>{heading.trim()}:</h3>
              <div style={styles.analysisContent}>
                {content.join(':').split('\n').map((line, lineIndex) => {
                  const [ingredient, description] = line.split('**:');
                  return (
                    <p key={lineIndex}>
                      {ingredient && (
                        <span style={styles.ingredientName}>{ingredient.trim()}:</span>
                      )}
                      {description && ` ${description.trim()}`}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Product Analysis</h2>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <div style={styles.hairType}>Selected Hair Type: {selectedHairType}</div>
      <div style={styles.hairType}>Selected Porosity: {selectedPorosity}</div>
      <button style={styles.button} onClick={handleSubmit}>
        Analyze Product
      </button>
      {renderAnalysis()}
    </div>
  );
}

export default ProductAnalysis;