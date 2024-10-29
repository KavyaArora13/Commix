import React, { useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import Touch from '../Components/Touch'
import '../Assets/Css/Faq/Faq.scss'

const Faq = () => {
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (section, index) => {
    setOpenQuestions(prev => ({
      ...prev,
      [section]: prev[section] === index ? null : index
    }));
  };

  const faqSections = [
    {
      title: "Ordering & Shipping",
      questions: [
        "What payment methods do you accept?",
        "How long will it take to receive my order?",
        "How long does it take to process a return?",
        "How can I find out if an item is back in stock?",
        "Do you have a size chart?"
      ]
    },
    {
      title: "Account & Privacy",
      questions: [
        "How do you protect my personal information?",
        "Do you offer gift cards?",
        "How can I contact customer service?",
        "Are your products sustainably sourced?",
        "What materials do you use in your clothing?"
      ]
    },
    {
      title: "Returns & Exchanges",
      questions: [
        "How can I find out about sales and promotions?",
        "Do you offer a student discount?",
        "Can I use multiple promo codes on one order?",
        "How can I track my order?",
        "How long does it take to process a return?"
      ]
    }
  ];

  return (
    <div className="faq-page">
      <Header/>
      <div className="container faq-container">
        <h1 className="faq-title text-center">Frequently Asked Questions</h1>
        <nav className="faq-breadcrumb text-center mb-4">
          <ol className="breadcrumb justify-content-center">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">Frequently Asked Questions</li>
          </ol>
        </nav>
        
        <div className="row faq-content">
          {/* Left Section */}
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="faq-left-section ">
              <div className="faq-image ">
                <img src="/images/faq.jpg" alt="FAQ" className="img-fluid" />
              </div>
              <h5>Quires Not Listed below</h5>
              <p className="small">Nulla facilisi. Suspendisse interdum sollicitudin velit, nec porttitor justo accumsan quis. Nunc at sollicitudin velit. Sed vitae feugiat nisi.</p>
              <button className="btn btn-dark btn-block">CHAT WITH US</button>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="col-md-7">
            <div className="faq-right-section">
              {faqSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="faq-section">
                  <h2 className="faq-section-title">{section.title}</h2>
                  <ul className="faq-question-list">
                    {section.questions.map((question, index) => (
                      <li key={index} className="faq-question-item">
                        <button
                          className="faq-question-button"
                          onClick={() => toggleQuestion(section.title, index)}
                        >
                          {question}
                          <span className={`faq-arrow ${openQuestions[section.title] === index ? 'open' : ''}`}>▼</span>
                        </button>
                        {openQuestions[section.title] === index && (
                          <div className="faq-answer">
                            {/* Answer content goes here */}
                            This is a placeholder answer for the question.
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Touch/>
      <Footer/>
    </div>
  )
}

export default Faq