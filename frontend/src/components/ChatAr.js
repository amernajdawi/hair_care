import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'linear-gradient(135deg, #F7D8D8 0%, #FBE6E6 100%)',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(247, 216, 216, 0.4)',
    backgroundImage: 'url("/images/wallpaper.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    zIndex: 1,
    textAlign: 'right',
    direction: 'rtl',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 240, 240, 0.7)',
    zIndex: -1,
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#8B7E7E',
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
    textAlign: 'right',
  },
  chatBox: {
    height: '400px',
    overflowY: 'auto',
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: 'linear-gradient(135deg, #FBE6E6 0%, #FFF0F0 100%)',
    border: '1px solid #F7D8D8',
    borderRadius: '8px',
    boxShadow: '0 3px 6px rgba(247, 216, 216, 0.2)',
  },
  message: {
    marginBottom: '8px',
    padding: '10px',
    borderRadius: '8px',
    maxWidth: '70%',
    clear: 'both',
  },
  userMessage: {
    background: 'linear-gradient(to bottom, #F7D8D8 0%, #FBE6E6 100%)',
    color: '#8B7E7E',
    boxShadow: '0 2px 4px rgba(247, 216, 216, 0.3)',
    float: 'left',
  },
  assistantMessage: {
    background: 'linear-gradient(135deg, #FBE6E6 0%, #FFF0F0 100%)',
    color: '#8B7E7E',
    boxShadow: '0 2px 4px rgba(247, 216, 216, 0.3)',
    float: 'right',
  },
  input: {
    width: 'calc(100% - 110px)',
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #F7D8D8',
    color: '#8B7E7E',
    textAlign: 'right',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'linear-gradient(to bottom, #F7D8D8 0%, #FBE6E6 100%)',
    color: '#8B7E7E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(247, 216, 216, 0.3)',
    float: 'left',
  },
  error: {
    color: 'red',
    marginBottom: '8px',
  },
};

const additionalStyles = {
  assistantMessage: {
    ...styles.assistantMessage,
    display: 'flex',
    flexDirection: 'column',
  },
  responseSection: {
    marginBottom: '8px',
    padding: '8px',
    backgroundColor: 'rgba(247, 216, 216, 0.3)',
    borderRadius: '4px',
  },
  responseTitle: {
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#8B7E7E',
  },
  responseContent: {
    marginLeft: '8px',
  },
};

function ChatAr({ selectedHairType, selectedPorosity, selectedScalpType, selectedDyed }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `مرحبًا! أنا خبير العناية بالشعر الذكي. أرى أن نوع شعرك هو ${selectedHairType} مع مسامية ${selectedPorosity}، وفروة رأس ${selectedScalpType}، وشعر ${selectedDyed}. كيف يمكنني مساعدتك في العناية بشعرك اليوم؟`,
      },
    ]);
  }, [selectedHairType, selectedPorosity, selectedScalpType, selectedDyed]);

  const formatAssistantMessage = (content) => {
    const sections = content.split('\n\n');
    return sections.map((section, index) => {
      const [title, ...contentLines] = section.split('\n');
      return (
        <div key={index} style={additionalStyles.responseSection}>
          <div style={additionalStyles.responseTitle}>{title}</div>
          <div style={additionalStyles.responseContent}>
            {contentLines.join('\n')}
          </div>
        </div>
      );
    });
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    console.log('إرسال طلب باللغة:', 'ar');

    try {
      const response = await axios.post(`${API_URL}/api/chat`, { 
        messages: newMessages,
        hairType: selectedHairType,
        porosity: selectedPorosity,
        scalpType: selectedScalpType,
        dyed: selectedDyed,
        language: 'ar'
      });
      let assistantMessage = response.data.response || '';
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      setError(`حدث خطأ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <motion.h2
        style={styles.heading}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        الدردشة مع خبير الشعر
      </motion.h2>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            ...styles.message,
            ...(msg.role === 'user' ? styles.userMessage : additionalStyles.assistantMessage),
          }}>
            {msg.role === 'user' ? msg.content : formatAssistantMessage(msg.content)}
          </div>
        ))}
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <div>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب رسالتك هنا..."
          disabled={isLoading}
        />
        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </div>
    </div>
  );
}

export default ChatAr;