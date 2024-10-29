import React, { useState, useEffect } from 'react';
import { ChevronRight, Send, X, MessageCircle } from 'lucide-react'; // Add MessageCircle icon
import botImage from '../../Assets/Image/Group 6.png';
import messageSound from '../../Assets/Sounds/message-sound.mp3'; // Import the sound file

const ChatbotModal = ({ isOpen, onClose, is404Page }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);

  const questions = [
    "What is your return policy?",
    "Where do you ship to?",
    "What is your shipping policy?",
    "Do you work with wholesalers?",
    "What is the scent of comix products?",
    "What hair types is comix good for?",
    "I want to make a purchase",
  ];

  useEffect(() => {
    if (isOpen) {
      if (is404Page) {
        setMessages([
          { 
            text: "Oops! It looks like you've landed on a page that doesn't exist. How can I help you find what you're looking for?", 
            sender: 'bot' 
          }
        ]);
      } else {
        setMessages([
          { 
            text: "Hi, I'm Alia from Comix. How can I help you?", 
            sender: 'bot' 
          }
        ]);
      }
    }
  }, [isOpen, is404Page]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');

      // Simulate bot response
      setTimeout(() => {
        let botResponse;
        if (inputMessage.toLowerCase().includes('hi') || inputMessage.toLowerCase().includes('hello')) {
          botResponse = "Hi there! How can I assist you today?";
        } else if (inputMessage.toLowerCase().includes('purchase') || inputMessage.toLowerCase().includes('buy')) {
          botResponse = "Great! I'd be happy to assist you with your purchase. Would you like to continue on WhatsApp for a more personalized shopping experience?";
          setShowWhatsAppButton(true);
        } else if (is404Page) {
          botResponse = "I'm sorry you're having trouble finding what you're looking for. Can you tell me more about what you need? I'd be happy to help guide you to the right place.";
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

  const handleWhatsAppPurchase = () => {
    const whatsappNumber = '+1234567890'; // Replace with your actual WhatsApp business number
    const message = encodeURIComponent('I want to make a purchase from Comix');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
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
                    <div key={qIndex} className="faq-item" onClick={() => setInputMessage(question)}>
                      {question}
                      <ChevronRight className="arrow-icon" size={16} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {showWhatsAppButton && (
          <div className="chatbot-actions">
            <button className="whatsapp-button" onClick={handleWhatsAppPurchase}>
              <MessageCircle size={18} />
              Continue on WhatsApp
            </button>
          </div>
        )}
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
