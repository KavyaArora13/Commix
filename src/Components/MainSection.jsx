// MainSection.jsx
import React from 'react';
import MainSlider from './MainSection/MainSlider';
import NewLaunchedSection from './MainSection/NewLaunchedSection';
import DiscoverHaircareSection from './MainSection/DiscoverHaircareSection';
import TwoImageSection from './MainSection/TwoImageSection';
import CommixIconicsSection from './MainSection/CommixIconicsSection';
import FullWidthImageSection from './MainSection/FullWidthImageSection';
import ExclusiveFestiveCombosSection from './MainSection/ExclusiveFestiveCombosSection';
import OfferSection from './MainSection/OfferSection';
import FeaturedSection from './FeaturedSection';
import BlogSection from './MainSection/BlogSection';
import SubscribeSection from './MainSection/SubscribeSection';
import '../Assets/Css/MainSection.scss';

const MainSection = () => {
  return (
    <section className="main-section">
      <MainSlider />
      <NewLaunchedSection />
      <DiscoverHaircareSection />
      <TwoImageSection />
      <CommixIconicsSection />
      <FullWidthImageSection />
      <ExclusiveFestiveCombosSection />
      <OfferSection />
      <FeaturedSection />
      <BlogSection />
      <SubscribeSection />
    </section>
  );
};

export default MainSection;