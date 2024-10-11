// MainSlider.jsx
import React from 'react';
import Slider from 'react-slick';
import SocialIcon from "../SocialIcon";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import '../../Assets/Css/MainSection.scss'


const MainSlider = () => {
  const settings = {
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    cssEase: 'ease-in-out',
  };

  const slidesData = [
    {
      heading: "SO POPULAR IT SOLD OUT",
      text: "Neque porro quisquam est qui dolorem",
      buttonText: "Shop Now",
    },
    {
      heading: "NEW ARRIVAL",
      text: "Lorem ipsum dolor sit amet",
      buttonText: "View Collection",
    },
    {
      heading: "BEST SELLERS",
      text: "Consectetur adipiscing elit",
      buttonText: "Explore Best Sellers",
    },
  ];

  return (
    <Slider {...settings}>
      {slidesData.map((slide, index) => (
        <div key={index} className="slide-content">
          <div className="content-wrapper">
            <h1>{slide.heading}</h1>
            <p>{slide.text}</p>
            <button className="shop-now-btn">
              <div className="btn-content">
                {slide.buttonText}
                <SocialIcon icon={faChevronRight} link="#" />
              </div>
            </button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default MainSlider;