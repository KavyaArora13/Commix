// src/Components/Blog/Card/Card.jsx
import React from 'react';
import './Card.scss';

const Card = ({ image, title }) => {
  return (
    <div className="blog-card">
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image" />
      </div>
      <h3 className="card-title">{title}</h3>
    </div>
  );
};

export default Card;