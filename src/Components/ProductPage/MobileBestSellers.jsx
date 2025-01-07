import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/free-mode';
import '../../Assets/Css/ProductPage/MobileBestSellers.scss';

const MobileBestSellers = ({ bestSellers }) => {
  return (
    <div className="mobile-best-sellers">
      <Swiper
        modules={[FreeMode]}
        spaceBetween={8}
        slidesPerView="auto"
        freeMode={true}
        className="best-sellers-swiper"
      >
        {bestSellers.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileBestSellers;
