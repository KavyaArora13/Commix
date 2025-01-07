import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import explode from '../../Assets/Image/explode.gif';

gsap.registerPlugin(ScrollTrigger);

const FallingElements = ({ imageSrc }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const gifDuration = 10000;

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    gsap.set(image, {
      x: '-100vw',
      y: '50vh',
      scale: 0.5,
      opacity: 0
    });

    setTimeout(() => {
      setIsVisible(true);
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      tl.to(image, {
        x: '100vw',
        scale: 1,
        opacity: 1,
        ease: 'none',
      });
    }, 100);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [imageSrc]);

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (!isPlaying) {
      setIsPlaying(true);
      
      setTimeout(() => {
        setIsPlaying(false);
      }, gifDuration);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="moving-image-container" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        overflow: 'hidden',
        zIndex: 9999,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    >
      <img 
        ref={imageRef}
        src={isPlaying ? explode : imageSrc} 
        alt="Moving element"
        onClick={handleImageClick}
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          objectFit: 'contain',
          transition: 'transform 0.3s ease'
        }}
      />
    </div>
  );
};

export default FallingElements;
