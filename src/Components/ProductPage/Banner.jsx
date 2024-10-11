import React from 'react';
import '../../Assets/Css/ProductPage/Banner.scss';

const Banner = () => {
    return (
        <div className="hero-banner mt-3 row">
            <div className="col-12 col-md-10 col-lg-12 text-center">
                <p className="date-range d-inline-block p-2 mb-3">March 4th - 8th</p>
                <h1 className="main-heading">Women's Day Exclusive <br/>Beauty Deals!</h1>
                <p className="sub-heading mt-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                </p>
            </div>
        </div>
    );
};

export default Banner;
