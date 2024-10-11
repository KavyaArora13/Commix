// TwoImageSection.jsx
import React from 'react';
import leftImage from '../../Assets/Image/leftImage.png';
import rightImage from '../../Assets/Image/rightImage.png';

const TwoImageSection = () => {
  return (
    <section className="two-image-section">
      <div className="two-images-container">
        <div className="image-wrapper">
          <img src={leftImage} alt="Left Image" className="responsive-image" />
        </div>
        <div className="image-wrapper">
          <img src={rightImage} alt="Right Image" className="responsive-image" />
        </div>
      </div>
    </section>
  );
};

export default TwoImageSection;