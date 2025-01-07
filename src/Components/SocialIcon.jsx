import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SocialIcon = ({ icon, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="social-icon">
      <FontAwesomeIcon icon={icon} />
    </a>
  );
};

export default SocialIcon;
