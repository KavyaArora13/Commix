import React, { useState, useEffect } from 'react';
import { ChevronRight, Send, X } from 'lucide-react'; // Add X icon
import botImage from '../../Assets/Image/Group 6.png';
import messageSound from '../../Assets/Sounds/message-sound.mp3'; // Import the sound file

const ChatbotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const questions = [
    "What is your return policy?",
    "Where do you ship to?",
    "What is your shipping policy?",
    "Do you work with wholesalers?",
    "What is the scent of comix products?",
    "What hair types is comix good for?",
  ];

  useEffect(() => {
    if (isOpen) {
      setMessages([{ text: "Hi, I'm Alia from Comix. How can I help you?", sender: 'bot' }]);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');

      // Simulate bot response
      setTimeout(() => {
        let botResponse;
        if (inputMessage.toLowerCase().includes('hi') || inputMessage.toLowerCase().includes('hello')) {
          botResponse = "Hi, I'm Alia from Comix. How can I help you?";
        } else {
          botResponse = "Here are some related questions:";
        }
        setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);

        // Play sound when bot responds
        const botAudio = new Audio(messageSound);
        botAudio.play();
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default action (like a form submission)
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`chatbot-modal ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <img src={botImage} alt="Ask Alia" className="bot-image" />
        <h2>Alia</h2>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="chatbot-content">
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <p>{message.text}</p>
              {message.sender === 'bot' && message.text.includes("Here are some related questions:") && (
                <div className="faq-section">
                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="faq-item">
                      {question}
                      <ChevronRight className="arrow-icon" size={16} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="leave-message">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown} // Add the key down event handler
            placeholder="Ask a question..."
            className="leave-message-input"
          />
          <Send className="send-icon" size={18} onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;