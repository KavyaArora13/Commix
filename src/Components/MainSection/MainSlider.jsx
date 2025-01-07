import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';
import defaultImage from '../../Assets/Image/main-image.png'
import '../../Assets/Css/MainSection.scss'

const MainSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/banners`);
      const homepageBanners = response.data.banners.filter(banner => banner.type === 'homepage');
      setBanners(homepageBanners.length > 0 ? homepageBanners : [{
        _id: 'default',
        title: 'Welcome to Our Store',
        description: 'Check out our amazing products',
        link: '/',
        image_url: defaultImage
      }]);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([{
        _id: 'default',
        title: 'Welcome to Our Store',
        description: 'Check out our amazing products',
        link: '/',
        image_url: defaultImage
      }]);
    }
  };

  const settings = {
    dots: banners.length > 1,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    adaptiveHeight: false
  };

  const renderShopNowButton = (link) => {
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="shop-now-btn no-underline">
          <div className="btn-content">
            SHOP NOW
            <FontAwesomeIcon icon={faChevronRight} className="social-icon" />
          </div>
        </a>
      );
    } else {
      return (
        <Link to={link} className="shop-now-btn no-underline">
          <div className="btn-content">
            SHOP NOW
            <FontAwesomeIcon icon={faChevronRight} className="social-icon" />
          </div>
        </Link>
      );
    }
  };

  return (
    <div className="main-section">
      <div className="main-slider-container">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner._id} className="slider-item">
              <div className="slide-content">
                <div className="slide-background" style={{
                  backgroundImage: `linear-gradient(to right, 
                    rgba(255, 255, 255, 0.9) 0%, 
                    rgba(255, 255, 255, 0.8) 15%, 
                    rgba(255, 255, 255, 0.6) 25%,
                    rgba(255, 255, 255, 0.2) 35%,
                    rgba(255, 255, 255, 0) 45%
                  ), url(${banner.image_url})`,
                  backgroundPosition: 'center right',
                  backgroundSize: 'cover'
                }} />
                <div className="content-wrapper">
                  <h1>{banner.title}</h1>
                  <p>{banner.description}</p>
                  {renderShopNowButton(banner.link)}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MainSlider;