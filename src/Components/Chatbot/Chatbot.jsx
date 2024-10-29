// src/Components/Chatbot/Chatbot.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import image from '../../Assets/Image/ask alia-01.png';
import ChatbotModal from './ChatbotModal';
import '../../Assets/Css/Chatbot/Chatbot.scss';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  const is404Page = location.pathname === '/404' || location.pathname === '*';

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const hideChatbot = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <div className="chatbot-image-container" onClick={toggleChatbot}>
          <img src={image} alt="Ask Alia" className="chatbot-image" />
          <button className="chatbot-close-button" onClick={hideChatbot} aria-label="Close chatbot">
            &times;
          </button>
        </div>
      )}
      <ChatbotModal isOpen={isOpen} onClose={toggleChatbot} is404Page={is404Page} />
    </div>
  );
};

export default Chatbot;