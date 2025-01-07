import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const NewLaunchedSection = () => {
  const sectionRef = useRef(null); // Ref to hold the section reference
  const observerRef = useRef(null); // Ref to hold the observer
  const [hasAnimated, setHasAnimated] = useState(false); // State to track if animation has occurred

  useEffect(() => {
    // Create an Intersection Observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          gsap.fromTo(entry.target, {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
          setHasAnimated(true); // Set to true to prevent further animations
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    // Observe the section
    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    return () => {
      // Cleanup: unobserve the section
      if (sectionRef.current) {
        observerRef.current.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]); // Add hasAnimated to the dependency array

  return (
    <section className="new-launched-section" ref={sectionRef}>
      <div className="heading-container">
        <img
          src={require('../../Assets/Image/bloomLeft.png')}
          alt="Flower Icon"
          className="decor-icon left-icon"
        />
        <h2 className="section-heading">
          <span className="decor-line">NEW LAUNCHED</span>
        </h2>
        <img
          src={require('../../Assets/Image/bloomRight.png')}
          alt="Flower Icon"
          className="decor-icon right-icon"
        />
      </div>

      <div className="image-container">
        <img
          src={require('../../Assets/Image/add-image.png')} // Desktop image
          alt="New Launch"
          className="launch-image desktop-image"
        />
        <img
          src={require('../../Assets/Image/image (1).avif')} // Mobile image
          alt="New Launch Mobile"
          className="launch-image mobile-image"
        />
      </div>
    </section>
  );
};

export default NewLaunchedSection;