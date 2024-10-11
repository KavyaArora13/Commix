import React from 'react';
import '../Assets/Css/Banner.scss';
import '../Components/FeaturedSection'

const Banner = () => {
    return (
        <div className="hero-banner mt-3">
            <div className="banner-content">
                <p className="date-range">March 4th - 8th</p>
                <h1 className="main-heading">Women's Day Exclusive Beauty Deals!</h1>
                <p className="sub-heading">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                </p>
            </div>
        </div>
    );
};

export default Banner;