import React from 'react'; // Import React
import './SectionHeader.scss';

const SectionHeader = ({ title }) => { // Accept title as a prop
    return (
      <section className="section-header">
        <div className="heading-container">
          <img src={require('../../../Assets/Image/bloomLeft.png')} alt="Bloom Left" className="decor-icon left-icon" />
          <h2 className="section-heading">{title}</h2> {/* Use the passed title */}
          <img src={require('../../../Assets/Image/bloomRight.png')} alt="Bloom Right" className="decor-icon right-icon" />
        </div>
      </section>
    );
};

export default SectionHeader; // Export the component