import React, { useState } from 'react';
import './ChatAssistant.css';

function ChatAssistant() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help with disaster information. How can I assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    setMessages([...messages, { text: input, sender: 'user' }]);
    
    // Process response (this would connect to your backend in a real implementation)
    setTimeout(() => {
      let response = "I'm processing your request...";
      
      if (input.toLowerCase().includes('sos')) {
        response = "I see you need emergency help. Let me guide you to our SOS feature where you can request immediate assistance.";
      } else if (input.toLowerCase().includes('aid')) {
        response = "Our Aid section provides information about available resources and how to access them.";
      } else if (input.toLowerCase().includes('analyze')) {
        response = "The Analyze section shows disaster data and trends to help understand the situation better.";
      }
      
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="chat-assistant">
      <div className="chat-header">
        <h3>Disaster Relief Assistant</h3>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question here..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatAssistant; 