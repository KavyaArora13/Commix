import React from 'react';
import '../../Assets/Css/About/AboutContent.scss';

const AboutContent = () => {
  return (
    <div className="about-content">
      <div className="content-section">
        <div className="image-container">
          <img src="/images/about1.jpg" alt="Our Team" />
        </div>
        <div className="text-container">
          <h2>Lorem Ipsum</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged.
          </p>
        </div>
      </div>
      
      <div className="content-section reverse">
        <div className="image-container">
          <img src="/images/about2.jpg" alt="Our Building" />
        </div>
        <div className="text-container">
          <h2>Lorem Ipsum</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;