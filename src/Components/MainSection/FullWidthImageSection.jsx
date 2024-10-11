// FullWidthImageSection.jsx
import React from 'react';

const FullWidthImageSection = () => {
  return (
    <section className="full-width-image-section">
      <img
        src={require('../../Assets/Image/bottle-image.png')}
        alt="Full width image"
        className="full-width-image"
      />
    </section>
  );
};

export default FullWidthImageSection;