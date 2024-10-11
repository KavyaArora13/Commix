// FeaturedSection.jsx
import React, { useState } from 'react';

const FeaturedSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="featured-section">
      <div className="heading-container">
        <img
          src={require('../Assets/Image/bloomLeft.png')}
          alt="Flower Icon"
          className="decor-icon left-icon"
        />
        <h2 className="section-heading">
          <span className="decor-line">WHAT WE'RE LOVING RIGHT NOW</span>
        </h2>
        <img
          src={require('../Assets/Image/bloomRight.png')}
          alt="Flower Icon"
          className="decor-icon right-icon"
        />
      </div>

      <div className="image-grid">
        {['left', 'right'].map((side, index) => (
          <div 
            key={index}
            className="product-card"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="media-container">
              {hoveredCard === index ? (
                <video
                  className="product-media"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/bd864b9d1184a0851962efed781eac79.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={require(`../Assets/Image/subscribe-${side}.png`)}
                  alt={`Product ${index + 1}`}
                  className="product-media"
                />
              )}
            </div>
            <div className="product-text">
              <h3>SUBSCRIBE & <br/>SAVE 15%</h3>
              <p>Rinse And Repeat with Comix</p>
              <button className="shop-now-btn">
                {index === 0 ? 'SHOP THE SET $44 - $59' : 'SUBSCRIBE NOW'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;