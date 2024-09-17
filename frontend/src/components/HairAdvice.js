import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

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
  select: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    borderColor: '#F7D8D8',
    color: '#8B7E7E',
    borderRadius: '4px',
    background: 'linear-gradient(to bottom, #FBE6E6 0%, #FFF0F0 100%)',
    boxShadow: '0 2px 4px rgba(255, 182, 193, 0.3)',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'linear-gradient(to bottom, #F7D8D8 0%, #FBE6E6 100%)',
    color: '#8B7E7E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(232, 180, 184, 0.3)',
  },
  advice: {
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
  adviceContent: {
    marginBottom: '16px',
    lineHeight: '1.6',
  },
  errorMessage: {
    color: '#FF6B6B',
    backgroundColor: '#FFE5E5',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '16px',
  },
  circleButton: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px solid #F7D8D8',
    background: '#FBE6E6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonImage: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    marginBottom: '5px',
  },
  buttonLabel: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#8B7E7E',
  },
  selectedButton: {
    backgroundColor: '#F7D8D8',
    boxShadow: '0 0 10px rgba(139, 126, 126, 0.5)',
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
  acceptButton: {
    padding: '12px 24px',
    backgroundColor: '#F7D8D8',
    color: '#8B7E7E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(232, 180, 184, 0.3)',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
};

const PLACEHOLDER_IMAGE = `${process.env.PUBLIC_URL}/images/placeholder.png`;

const hairTypes = [
  { name: "Type 1A", image: `${process.env.PUBLIC_URL}/images/TypeA1.png` },
  { name: "Type 1B", image: `${process.env.PUBLIC_URL}/images/TypeB1.png` },
  { name: "Type 1C", image: `${process.env.PUBLIC_URL}/images/TypeC1.png` },
  { name: "Type 2A", image: `${process.env.PUBLIC_URL}/images/TypeA2.png` },
  { name: "Type 2B", image: `${process.env.PUBLIC_URL}/images/TypeB2.png` },
  { name: "Type 2C", image: `${process.env.PUBLIC_URL}/images/TypeC2.png` },
  { name: "Type 3A", image: `${process.env.PUBLIC_URL}/images/TypeA3.png` },
  { name: "Type 3B", image: `${process.env.PUBLIC_URL}/images/TypeB3.png` },
  { name: "Type 3C", image: `${process.env.PUBLIC_URL}/images/TypeC3.png` },
  { name: "Type 4A", image: `${process.env.PUBLIC_URL}/images/TypeA4.png` },
  { name: "Type 4B", image: `${process.env.PUBLIC_URL}/images/TypeB4.png` },
  { name: "Type 4C", image: `${process.env.PUBLIC_URL}/images/TypeC4.png` },
];

const porosityTypes = [
  { name: 'High Porosity', image: `${process.env.PUBLIC_URL}/images/high_porosity.png` },
  { name: 'Normal Porosity', image: `${process.env.PUBLIC_URL}/images/normal_porosity.png` },
  { name: 'Low Porosity', image: `${process.env.PUBLIC_URL}/images/low_porosity.png` },
];

function HairAdvice({ setSelectedHairType, setSelectedPorosity }) {
  const [hairType, setHairType] = useState('');
  const [porosity, setPorosity] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHairAdvice = useCallback(async () => {
    if (!hairType || !porosity) {
      setError('Please select both hair type and porosity before analysis.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/hair-advice`, { 
        hairType,
        porosity,
        language: 'en'  // Add this line
      });

      setAdvice(response.data.advice);
      setSelectedHairType(hairType);
      setSelectedPorosity(porosity);
    } catch (error) {
      console.error('Error fetching hair advice:', error);
      setError('An error occurred while fetching advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [hairType, porosity, setSelectedHairType, setSelectedPorosity]);

  const handleHairTypeSelect = useCallback((selectedHairType) => {
    setHairType(selectedHairType);
    setSelectedHairType(selectedHairType);
    if (selectedHairType && porosity) {
      fetchHairAdvice();
    }
  }, [porosity, setSelectedHairType, fetchHairAdvice]);

  const handlePorositySelect = useCallback((selectedPorosity) => {
    setPorosity(selectedPorosity);
    setSelectedPorosity(selectedPorosity);
    if (hairType && selectedPorosity) {
      fetchHairAdvice();
    }
  }, [hairType, setSelectedPorosity, fetchHairAdvice]);

  const handleImageError = useCallback((e) => {
    console.error(`Failed to load image: ${e.target.src}`);
    e.target.src = PLACEHOLDER_IMAGE;
    e.target.onerror = null;
  }, []);

  const handleAcceptAndGetAdvice = useCallback(() => {
    if (hairType && porosity) {
      fetchHairAdvice();
    } else {
      setError('Please select both hair type and porosity before getting advice.');
    }
  }, [hairType, porosity, fetchHairAdvice]);

  const renderAdvice = useCallback(() => {
    if (!advice) return null;
    
    const cleanAdvice = advice.replace(/[#*]/g, '').trim();
    const sections = cleanAdvice.split('\n\n').filter(section => section.trim() !== '');
    
    return (
      <div style={styles.advice}>
        {sections.map((section, index) => {
          const [heading, ...content] = section.split(':');
          return (
            <div key={index}>
              <h3 style={styles.sectionHeading}>{heading.trim()}:</h3>
              <div style={styles.adviceContent}>
                {content.join(':').split('\n').map((line, lineIndex) => (
                  <p key={lineIndex}>{line.trim()}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [advice]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Select Your Hair Type</h2>
      <div style={styles.buttonContainer}>
        {hairTypes.map((type) => (
          <button
            key={type.name}
            onClick={() => handleHairTypeSelect(type.name)}
            style={{
              ...styles.circleButton,
              ...(hairType === type.name ? styles.selectedButton : {}),
            }}
          >
            <LazyLoadImage
              src={type.image}
              alt={type.name}
              effect="blur"
              style={styles.buttonImage}
              onError={handleImageError}
            />
            <span style={styles.buttonLabel}>{type.name}</span>
          </button>
        ))}
      </div>
      
      <h2 style={styles.heading}>Select Your Hair Porosity</h2>
      <div style={styles.buttonContainer}>
        {porosityTypes.map((porosityType) => (
          <button
            key={porosityType.name}
            onClick={() => handlePorositySelect(porosityType.name)}
            style={{
              ...styles.circleButton,
              ...(porosity === porosityType.name ? styles.selectedButton : {}),
            }}
          >
            <LazyLoadImage
              src={porosityType.image}
              alt={porosityType.name}
              effect="blur"
              style={styles.buttonImage}
              onError={handleImageError}
            />
            <span style={styles.buttonLabel}>{porosityType.name}</span>
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleAcceptAndGetAdvice}
        style={styles.acceptButton}
      >
        Accept and Get Advice
      </button>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      {isLoading ? (
        <div style={styles.loadingText}>Please wait... Generating hair advice ✨</div>
      ) : (
        renderAdvice()
      )}
    </div>
  );
}

export default React.memo(HairAdvice);