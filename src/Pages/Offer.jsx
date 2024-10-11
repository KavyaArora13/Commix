import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Touch from '../Components/Offer/Touch';
import CouponCard from '../Components/Offer/CouponCard';
import '../Assets/Css/Offer/Offer.scss';

const Offer = () => {
  return (
    <>
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <div className="container mt-4">
        <div className="row">
          <CouponCard imageSrc="/images/iconic1.png" couponCode="COUPON 1499"/>
          <CouponCard imageSrc="/images/iconic2.png" couponCode="COUPON 2499"/>
          <CouponCard imageSrc="/images/iconic1.png" couponCode="COUPON 3499"/>
          <CouponCard imageSrc="/images/iconic2.png" couponCode="COUPON 4499"/>
        </div>
      </div>

      {/* Call to action or offer-related component */}
      <Touch />

      {/* Footer Section */}
      <Footer />
    </>
  );
};

export default Offer;
