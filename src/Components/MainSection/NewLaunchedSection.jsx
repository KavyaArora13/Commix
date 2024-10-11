import React from 'react';

const NewLaunchedSection = () => {
  return (
    <section className="new-launched-section">
      <div className="heading-container">
        <img
          src={require('../../Assets/Image/bloomLeft.png')}
          alt="Flower Icon"
          className="decor-icon left-icon"
        />
        <h2 className="section-heading">
          <span className="decor-line">NEW LAUNCHED</span>
        </h2>
        <img
          src={require('../../Assets/Image/bloomRight.png')}
          alt="Flower Icon"
          className="decor-icon right-icon"
        />
      </div>

      <div className="image-container">
        <img
          src={require('../../Assets/Image/add-image.png')} // Desktop image
          alt="New Launch"
          className="launch-image desktop-image"
        />
        <img
          src={require('../../Assets/Image/image (1).avif')} // Mobile image
          alt="New Launch Mobile"
          className="launch-image mobile-image"
        />
      </div>
    </section>
  );
};

export default NewLaunchedSection;