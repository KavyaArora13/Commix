// src/Components/Blog/CardContainer/CardContainer.jsx
import React, { useRef, useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardContainer.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// Import required modules
import { Pagination } from 'swiper/modules';

const CardContainer = ({ posts }) => {
  const sliderRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (posts.length > 4) {
      setShowButtons(true);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [posts]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -288 : 288;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isMobile) {
    return (
      <div className="card-container mobile">
        <Swiper
          slidesPerView={1.2}
          spaceBetween={10}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mobile-swiper"
        >
          {posts.map((post, index) => (
            <SwiperSlide key={index}>
              <Card image={post.image} title={post.title} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="read-more">
          <a href="#" className="read-more-link">Read More Articles</a>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container desktop">
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