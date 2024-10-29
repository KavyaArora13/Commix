import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Dialogue = ({ onClose, position }) => (
  <div style={{
    position: 'fixed',
    top: position.y,
    left: position.x,
    transform: 'translate(20px, -100%)', // Offset 20px to the right
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    zIndex: 10000
  }}>
    <h2>Hello!</h2>
    <p>Our products contains alum.</p>
    <button onClick={onClose}>Close</button>
  </div>
);

const FallingElements = ({ imageSrc }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [dialoguePosition, setDialoguePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    // Set initial position
    gsap.set(image, {
      x: '-100%',
      y: '50vh',
      scale: 0.5,
    });

    // Animate the image across the screen
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
      ease: 'none',
      onUpdate: () => {
        if (showDialogue) {
          const rect = image.getBoundingClientRect();
          setDialoguePosition({ x: rect.right, y: rect.top }); // Use right instead of left + width/2
        }
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [imageSrc, showDialogue]);

  const handleImageClick = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setDialoguePosition({ x: rect.right, y: rect.top }); // Use right instead of left + width/2
    setShowDialogue(true);
  };

  return (
    <>
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
          zIndex: 9999
        }}
      >
        <img 
          ref={imageRef}
          src={imageSrc} 
          alt="Moving element"
          onClick={handleImageClick}
          style={{
            position: 'absolute',
            width: '100px',
            height: 'auto',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        />
      </div>
      {showDialogue && (
        <Dialogue 
          onClose={() => setShowDialogue(false)} 
          position={dialoguePosition}
        />
      )}
    </>
  );
};

export default FallingElements;
