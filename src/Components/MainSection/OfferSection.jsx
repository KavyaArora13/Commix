// OfferSection.jsx
import React from 'react';

const OfferSection = () => {
  return (
    <section className="offer-section">
      <div className="offer-image-container">
        <img
          src={require('../../Assets/Image/offer-image.png')}
          alt="Offer Image"
          className="offer-image"
        />
      </div>
    </section>
  );
};

export default OfferSection;