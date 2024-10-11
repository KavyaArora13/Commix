// ExclusiveFestiveCombosSection.jsx
import React from 'react';

const ExclusiveFestiveCombosSection = () => {
  return (
    <section className="exclusive-festive-combos-section">
      <div className="heading-container">
        <img
          src={require('../../Assets/Image/bloomLeft.png')}
          alt="Flower Icon"
          className="decor-icon left-icon"
        />
        <h2 className="section-heading">
          <span className="decor-line">EXCLUSIVE FESTIVE COMBOS</span>
        </h2>
        <img
          src={require('../../Assets/Image/bloomRight.png')}
          alt="Flower Icon"
          className="decor-icon right-icon"
        />
      </div>

      <div className="combo-image-container">
        <img
          src={require('../../Assets/Image/combo-image.png')}
          alt="Festive Combos"
          className="combo-image"
        />
      </div>
    </section>
  );
};

export default ExclusiveFestiveCombosSection;
