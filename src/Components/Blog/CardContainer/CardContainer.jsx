// src/Components/Blog/CardContainer/CardContainer.jsx
import React, { useRef, useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardContainer.scss';

const CardContainer = ({ posts }) => {
  const sliderRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (posts.length > 4) {
      setShowButtons(true);
    }
  }, [posts]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -288 : 288;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="card-container">
      <div className="card-slider" ref={sliderRef}>
        {posts.map((post, index) => (
          <Card key={index} image={post.image} title={post.title} />
        ))}
      </div>
      {showButtons && (
        <>
          <button className="slider-button prev" onClick={() => scroll('left')}>&lt;</button>
          <button className="slider-button next" onClick={() => scroll('right')}>&gt;</button>
        </>
      )}
      <div className="read-more">
        <a href="#" className="read-more-link">Read More Articles</a>
      </div>
    </div>
  );
};

export default CardContainer;