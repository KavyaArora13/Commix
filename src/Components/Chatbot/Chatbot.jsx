import React, { useState } from 'react';
import image from '../../Assets/Image/ask alia-01.png';
import ChatbotModal from './ChatbotModal';
import '../../Assets/Css/Chatbot/Chatbot.scss';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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
          <button className="close-button" onClick={hideChatbot}>×</button>
        </div>
      )}
      <ChatbotModal isOpen={isOpen} onClose={toggleChatbot} />
    </div>
  );
};

export default Chatbot;