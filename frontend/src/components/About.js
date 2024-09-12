import React from 'react';

const styles = {
  container: {
    padding: '20px',
    backgroundImage: 'url("/images/wallpaper.jpg")', // Add this line
    backgroundSize: 'cover', // Ensure the image covers the container
    backgroundPosition: 'center', // Center the background image
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(247, 216, 216, 0.4)', // Softer shadow
    position: 'relative',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 240, 240, 0.7)', // Lighter, softer pink overlay
    zIndex: -1,
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#8B7E7E', // Muted dark pink for text
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
  },
  paragraph: {
    marginBottom: '16px',
    lineHeight: '1.6',
    color: '#8B7E7E', // Muted dark pink for text
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '10px',
    color: '#F7D8D8', // Soft pastel pink
    textShadow: '0 0 3px rgba(232, 180, 184, 0.5)',
  },
  bold: {
    fontWeight: 'bold',
    color: '#8B7E7E', // Muted dark pink for text
    textShadow: '0 0 1px rgba(0, 0, 0, 0.3)',
  },
};

function About() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <h2 style={styles.heading}>Welcome to Your Hair Care Journey</h2>
      <p style={styles.paragraph}>
        Discover the perfect blend of science and beauty with our AI-powered personalized hair care companion. 
      </p>
      <h3 style={styles.heading}>Unlock Your Hair's Potential:</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <span style={styles.icon}>🔬</span>
          <span><span style={styles.bold}>Smart Hair Analysis:</span> Uncover your unique hair type and receive tailor-made care suggestions.</span>
        </li>
        <li style={styles.listItem}>
          <span style={styles.icon}>🤖</span>
          <span><span style={styles.bold}>24/7 AI Hair Expert:</span> Chat with our friendly AI assistant for instant, personalized hair advice.</span>
        </li>
        <li style={styles.listItem}>
          <span style={styles.icon}>📸</span>
          <span><span style={styles.bold}>Product Compatibility Check:</span> Snap a photo of any hair product for an AI-powered analysis of its suitability for your hair.</span>
        </li>
      </ul>
      <p style={styles.paragraph}>
        From tackling persistent hair challenges to discovering your perfect product match, our intelligent platform is your partner in achieving luscious, healthy locks. We combine cutting-edge AI technology with expert hair care knowledge to provide you with a routine designed for your hair.
      </p>
      <p style={styles.paragraph}>
        Say goodbye to one-size-fits-all solutions and hello to hair care that's as unique as you are. Whether you're a hair care novice or a seasoned enthusiast, help you fall in love with your hair all over again.
      </p>
      <p style={styles.bold}>
        Ready to embark on your personalized hair care adventure? Start by identifying your hair type in the Hair Type tab!
      </p>
    </div>
  );
}

export default About;