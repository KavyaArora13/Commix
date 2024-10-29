import React from 'react';
import '../Assets/Css/SectionTitle.scss';
import bloomLeft from '../Assets/Image/bloomLeft.png' // Adjust the path as necessary
import bloomRight from '../Assets/Image/bloomRight.png'; // Adjust the path as necessary

const SectionTitle = ({ title }) => {
  return (
    <div className='section-title-component text-center mt-5'>
      <div className='d-flex justify-content-center align-items-center'>
        <img src={bloomLeft} alt="Decorative Left Broom" className="decorative-broom" />
        <h2 className="section-title-text mx-3">{title}</h2>
        <img src={bloomRight} alt="Decorative Right Broom" className="decorative-broom" />
      </div>
    </div>
  );
};

export default SectionTitle;