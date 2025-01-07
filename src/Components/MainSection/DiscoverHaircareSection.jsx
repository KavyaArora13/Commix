import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import gsap from 'gsap';

const DiscoverHaircareSection = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeIndex, setActiveIndex] = useState(null);
  const productRefs = useRef([]); // Ref to hold product card references
  const observerRef = useRef(null); // Ref to hold the observer
  const [hasAnimated, setHasAnimated] = useState(false); // State to track if animation has occurred

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    // Observe each product card
    productRefs.current.forEach(ref => {
      if (ref) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      // Cleanup: unobserve all product cards
      productRefs.current.forEach(ref => {
        if (ref) {
          observerRef.current.unobserve(ref);
        }
      });
    };
  }, [hasAnimated]); // Add hasAnimated to the dependency array

  const products = [
    { name: 'Custom Shampoo', image: 'product1.png', category: 'HAIRCARE', price: '$23.00' },
    { name: 'Custom Conditioner', image: 'product2.png', category: 'HAIRCARE', price: '$23.00' },
    { name: 'Custom Cream', image: 'product3.png', category: 'HAIRCARE', price: '$23.00', smallImage: true },
    { name: 'Custom Facewash', image: 'product4.png', category: 'HAIRCARE', price: '$23.00' },
  ];

  const videoSrc = 'f7175214cf3337ef11c0d61e15bb3970.mp4';

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setActiveIndex(next),
  };

  const renderProductCard = (product, index) => (
    <div 
      key={index} 
      className={`product-card ${product.smallImage ? 'small-image' : ''}`}
      ref={el => productRefs.current[index] = el} // Assign ref to each product card
      onMouseEnter={() => !isMobile && setActiveIndex(index)}
      onMouseLeave={() => !isMobile && setActiveIndex(null)}
    >
      <img
        src={require(`../../Assets/Image/${product.image}`)}
        alt={product.name}
        className="product-image"
      />
      {activeIndex === index && (
        <video
          className="product-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={`/${videoSrc}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="product-info">
        <h4 className="product-category">{product.category}</h4>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
      </div>
    </div>
  );

  return (
    <section className="discover-haircare-section">
      <div className="heading-container">
        <img src={require('../../Assets/Image/bloomLeft.png')} alt="Flower Icon" className="decor-icon" />
        <h2 className="section-heading">DISCOVER HAIRCARE FOR ALL</h2>
        <img src={require('../../Assets/Image/bloomRight.png')} alt="Flower Icon" className="decor-icon"/>
      </div>

      <div className={`products-container ${isMobile ? 'mobile-slider' : ''}`}>
        {isMobile ? (
          <Slider {...sliderSettings}>
            {products.map((product, index) => renderProductCard(product, index))}
          </Slider>
        ) : (
          products.map((product, index) => renderProductCard(product, index))
        )}
      </div>
    </section>
  );
};

export default DiscoverHaircareSection;