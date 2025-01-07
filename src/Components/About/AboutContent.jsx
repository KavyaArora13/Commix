import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import '../../Assets/Css/About/AboutContent.scss';

gsap.registerPlugin(ScrollTrigger);

const AboutContent = () => {
  useEffect(() => {
    // Select both headings and paragraphs for animation
    const textElements = document.querySelectorAll('.animate-text, .animate-heading');
    
    textElements.forEach((element) => {
      const splitText = new SplitType(element, { 
        types: 'chars',
        tagName: 'span'
      });

      gsap.fromTo(splitText.chars,
        {
          color: '#CCCCCC', // Lighter gray for more contrast
        },
        {
          color: '#000000', // Black
          duration: 0.5,
          stagger: {
            each: 0.02, // Smaller value for quicker sequence
            from: "start"
          },
          scrollTrigger: {
            trigger: element,
            start: "top 80%", // Start earlier
            end: "top 20%", // End later
            scrub: 0.5, // Smoother scrub
            toggleActions: "restart pause reverse pause"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="about-content">
      <div className="content-section">
        <div className="image-container">
          <img src="/images/about1.jpg" alt="About Us Section 1" />
        </div>
        <div className="text-container">
          <h2 className="animate-heading">Our Story</h2>
          <p className="animate-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      <div className="content-section reverse">
        <div className="image-container">
          <img src="/images/about2.jpg" alt="About Us Section 2" />
        </div>
        <div className="text-container">
          <h2 className="animate-heading">Our Mission</h2>
          <p className="animate-text">
            Duis aute irure dolor in reprehenderit in voluptate velit esse 
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
            cupidatat non proident, sunt in culpa qui officia deserunt mollit 
            anim id est laborum.
          </p>
        </div>
      </div>

      <div className="content-section">
        <div className="image-container">
          <img src="/images/about3.jpg" alt="About Us Section 3" />
        </div>
        <div className="text-container">
          <h2 className="animate-heading">Our Values</h2>
          <p className="animate-text">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa 
            quae ab illo inventore veritatis et quasi architecto beatae vitae 
            dicta sunt explicabo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;