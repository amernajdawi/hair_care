import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'rgba(247, 216, 216, 0.7)',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(247, 216, 216, 0.4)',
    textAlign: 'right', // Add this line
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#8B7E7E',
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
    textAlign: 'right', // Add this line
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
    textAlign: 'right', // Align text to the right for Arabic
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

function ProductAnalysisAr({ selectedHairType, selectedPorosity }) {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeProduct = useCallback(async (uploadedFile) => {
    if (!uploadedFile) {
      alert("الرجاء اختيار ملف أولاً.");
      return;
    }
    if (!selectedHairType) {
      alert("الرجاء اختيار نوع الشعر.");
      return;
    }
    if (!selectedPorosity) {
      alert("الرجاء اختيار مستوى المسامية في قسم نصائح الشعر.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', uploadedFile);
    formData.append('hairType', selectedHairType);
    formData.append('porosity', selectedPorosity);
    formData.append('language', 'ar');

    try {
      const response = await axios.post('http://localhost:8000/api/product-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        alert("تم استلام استجابة غير متوقعة من الخادم.");
      }
    } catch (error) {
      console.error('خطأ في تحليل المنتج:', error);
      alert('حدث خطأ أثناء تحليل المنتج. يرجى المحاولة مرة أخرى.');
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
                {content.join(':').split('\n').map((line, lineIndex) => {
                  const [subHeading, ...subContent] = line.split(':');
                  return (
                    <div key={lineIndex} style={{ marginBottom: '10px' }}>
                      <strong>{subHeading.trim()}:</strong>
                      <p style={{ marginTop: '5px', marginRight: '20px' }}>{subContent.join(':').trim()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [analysis]);

  useEffect(() => {
    console.log('ProductAnalysisAr mounted');
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`وقت تحميل المكون: ${endTime - startTime}ms`);
    };
  }, []);

  if (!selectedHairType || !selectedPorosity) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>تحليل المنتج</h2>
        <p>الرجاء تحديد نوع الشعر والمسامية أولاً.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>تحليل المنتج</h2>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div style={styles.hairType}>نوع الشعر المحدد: {selectedHairType}</div>
      <div style={styles.hairType}>المسامية المحددة: {selectedPorosity}</div>
      {isLoading && (
        <div style={styles.loadingText}>يرجى الانتظار... جاري تحليل المنتج الخاص بك ✨</div>
      )}
      {!isLoading && renderAnalysis()}
    </div>
  );
}

export default React.memo(ProductAnalysisAr);
