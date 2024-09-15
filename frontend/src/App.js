import React, { useState } from 'react';
import HairAdvice from './components/HairAdvice';
import Chat from './components/Chat';
import ProductAnalysis from './components/ProductAnalysis';
import HairAdviceAr from './components/HairAdviceAr';
import ChatAr from './components/ChatAr';
import ProductAnalysisAr from './components/ProductAnalysisAr';
import About from './components/About';
import AboutAr from './components/AboutAr';

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    backgroundColor: '#FFF0F0', // Lighter, softer pink
    color: '#8B7E7E', // Muted dark pink for text
  },
  header: {
    backgroundColor: '#F7D8D8', // Soft pastel pink
    color: '#8B7E7E', // Muted dark pink for text
    padding: '0.5rem 1rem', // Keeping the reduced padding
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // This will help distribute space evenly
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    height: '140px', // Increased from 120px to 140px
    marginRight: '1rem', // Slightly reduced margin
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1, // This will allow the title to take up available space
  },
  title: {
    fontSize: '2rem', // Increased from 1.5rem to 2rem
    color: '#8B7E7E', // Muted dark pink for text
    margin: 0, // Remove default margin
    fontFamily: 'Brush Script MT, cursive', // Apply cursive font
    fontWeight: 'normal', // Ensure the font isn't bold
  },
  heart: {
    color: '#FF69B4', // Pink color for the heart
    fontSize: '1.5rem',
    marginLeft: '0.5rem',
  },
  subtitle: {
    fontSize: '0.8rem', // Reduced font size
    color: '#8B7E7E', // Muted dark pink for text
  },
  main: {
    display: 'flex',
    flexGrow: 1,
    padding: '2rem',
    gap: '2rem',
  },
  nav: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  navButton: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBE6E6',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    color: '#8B7E7E',
    fontWeight: 'bold',
    padding: '10px',
  },
  navButtonIcon: {
    width: '50px',
    height: '50px',
    marginBottom: '0.5rem',
  },
  navButtonText: {
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  activeNavButton: {
    backgroundColor: '#F7D8D8',
  },
  content: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  footer: {
    backgroundColor: '#F7D8D8', // Soft pastel pink
    color: '#8B7E7E', // Muted dark pink for text
    padding: '1rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
  headerImage: {
    height: '30px', // Reduced size of the hair type image
    marginRight: '0.5rem',
    cursor: 'pointer',
  },
  errorMessage: {
    color: '#FF6B6B',
    backgroundColor: '#FFE5E5',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  languageButton: {
    padding: '5px 10px',
    backgroundColor: '#F7D8D8',
    color: '#8B7E7E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
};

function App() {
  const [page, setPage] = useState('Hair Type');
  const [selectedHairType, setSelectedHairType] = useState('');
  const [selectedPorosity, setSelectedPorosity] = useState('');
  const [showError, setShowError] = useState(false);
  const [language, setLanguage] = useState('en');

  console.log('App rendering', { page, selectedHairType, selectedPorosity, language });

  const handlePageChange = (newPage) => {
    if (newPage === 'About' || newPage === 'Hair Type' || (selectedHairType && selectedPorosity)) {
      setPage(newPage);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };

  const renderComponent = () => {
    switch (page) {
      case 'Hair Type':
        return language === 'en' 
          ? <HairAdvice setSelectedHairType={setSelectedHairType} setSelectedPorosity={setSelectedPorosity} />
          : <HairAdviceAr setSelectedHairType={setSelectedHairType} setSelectedPorosity={setSelectedPorosity} />;
      case 'Care Advice':  // Changed from 'Chat' to 'Care Advice'
        return language === 'en'
          ? <Chat selectedHairType={selectedHairType} selectedPorosity={selectedPorosity} />
          : <ChatAr selectedHairType={selectedHairType} selectedPorosity={selectedPorosity} />;
      case 'Product Analysis':
        return language === 'en'
          ? <ProductAnalysis selectedHairType={selectedHairType} selectedPorosity={selectedPorosity} />
          : <ProductAnalysisAr selectedHairType={selectedHairType} selectedPorosity={selectedPorosity} />;
      case 'About':
        return language === 'en' ? <About /> : <AboutAr />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <img src="/images/logo.png" alt="Logo" style={styles.logo} />
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Hair Care Tailored For You</h1>
          {/* Removed the heart span */}
        </div>
        <img 
          src="/images/hair_Type.png" 
          alt="Hair Type" 
          style={styles.headerImage}
          onClick={() => setPage('Hair Type')}
        />
        <span style={styles.subtitle}>Powered by AI Hair Care</span>
        <button onClick={toggleLanguage} style={styles.languageButton}>
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </header>

      <main style={styles.main}>
        <nav style={styles.nav}>
          {['Hair Type', 'Care Advice', 'Product Analysis', 'About'].map((item) => (
            <button
              key={item}
              onClick={() => handlePageChange(item)}
              style={{
                ...styles.navButton,
                ...(page === item ? styles.activeNavButton : {}),
              }}
            >
              {item === 'Hair Type' && (
                <img
                  src="/images/hair_Type.png"
                  alt=""
                  style={styles.navButtonIcon}
                />
              )}
              {item === 'Care Advice' && (
                <img
                  src="/images/Chat.png"
                  alt=""
                  style={styles.navButtonIcon}
                />
              )}
              {item === 'Product Analysis' && (
                <img
                  src="/images/product_analysis.png"
                  alt=""
                  style={styles.navButtonIcon}
                />
              )}
              {item === 'About' && (
                <img
                  src="/images/about.png"
                  alt=""
                  style={styles.navButtonIcon}
                />
              )}
              <span style={styles.navButtonText}>{language === 'en' ? item : (item === 'Hair Type' ? 'نوع الشعر' : item === 'Care Advice' ? 'نصائح العناية' : item === 'Product Analysis' ? 'تحليل المنتج' : 'About')}</span>
            </button>
          ))}
        </nav>
        <div style={styles.content}>
          {showError && (
            <div style={styles.errorMessage}>
              Please select your hair type and porosity before accessing other pages.
            </div>
          )}
          {renderComponent()}
        </div>
      </main>

      <footer style={styles.footer}>
        Made with ❤️ by Hair Care Expert | © 2024 All Rights Reserved
      </footer>
    </div>
  );
}

export default App;