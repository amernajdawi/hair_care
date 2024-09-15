import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'linear-gradient(135deg, #F7D8D8 0%, #FBE6E6 100%)', // Soft pastel pink gradient
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(247, 216, 216, 0.4)', // Softer shadow
    backgroundImage: 'url("/images/wallpaper.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
  chatBox: {
    height: '400px',
    overflowY: 'auto',
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: 'linear-gradient(135deg, #FBE6E6 0%, #FFF0F0 100%)', // Very light pastel pink gradient
    border: '1px solid #F7D8D8', // Soft pastel pink border
    borderRadius: '8px',
    boxShadow: '0 3px 6px rgba(247, 216, 216, 0.2)',
  },
  message: {
    marginBottom: '8px',
    padding: '10px',
    borderRadius: '8px',
    maxWidth: '70%',
  },
  userMessage: {
    background: 'linear-gradient(to bottom, #F7D8D8 0%, #FBE6E6 100%)', // Soft pastel pink gradient
    color: '#8B7E7E', // Muted dark pink for text
    boxShadow: '0 2px 4px rgba(247, 216, 216, 0.3)',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    background: 'linear-gradient(135deg, #FBE6E6 0%, #FFF0F0 100%)', // Very light pastel pink gradient
    color: '#8B7E7E', // Muted dark pink for text
    boxShadow: '0 2px 4px rgba(247, 216, 216, 0.3)',
    alignSelf: 'flex-start',
  },
  input: {
    width: 'calc(100% - 110px)',
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #F7D8D8', // Soft pastel pink border
    color: '#8B7E7E', // Muted dark pink for text
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'linear-gradient(to bottom, #F7D8D8 0%, #FBE6E6 100%)', // Soft pastel pink gradient
    color: '#8B7E7E', // Muted dark pink for text
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(247, 216, 216, 0.3)',
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
    backgroundColor: 'rgba(247, 216, 216, 0.3)', // Soft pastel pink with opacity
    borderRadius: '4px',
  },
  responseTitle: {
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#8B7E7E', // Muted dark pink for text
  },
  responseContent: {
    marginLeft: '8px',
  },
};

function Chat({ selectedHairType, selectedPorosity }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hello! I'm your AI hair care expert. I see that your hair type is ${selectedHairType} with ${selectedPorosity} porosity. How can I help you with your hair today?`,
      },
    ]);
  }, [selectedHairType, selectedPorosity]);

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

    try {
      const response = await axios.post(`${API_URL}/api/chat`, { 
        messages: newMessages,
        hairType: selectedHairType,
        porosity: selectedPorosity
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false,
      });
      let assistantMessage = response.data.response || '';
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <h2 style={styles.heading}>Chat with Hair Expert</h2>
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
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chat;