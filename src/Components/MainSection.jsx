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
import withScrollAnimation from './withScrollAnimation';

const MainSection = () => {
  const AnimatedNewLaunchedSection = withScrollAnimation(NewLaunchedSection, { delay: 0 });
  const AnimatedDiscoverHaircareSection = withScrollAnimation(DiscoverHaircareSection, { delay: 0.1 });
  const AnimatedTwoImageSection = withScrollAnimation(TwoImageSection, { delay: 0.2 });
  const AnimatedCommixIconicsSection = withScrollAnimation(CommixIconicsSection, { delay: 0.1 });
  const AnimatedExclusiveFestiveCombosSection = withScrollAnimation(ExclusiveFestiveCombosSection, { delay: 0.2 });
  const AnimatedOfferSection = withScrollAnimation(OfferSection, { delay: 0.1 });
  const AnimatedFeaturedSection = withScrollAnimation(FeaturedSection, { delay: 0.2 });
  const AnimatedBlogSection = withScrollAnimation(BlogSection, { delay: 0.1 });

  return (
    <>
      <section className="main-section">
        <MainSlider />
        <AnimatedNewLaunchedSection />
        <AnimatedDiscoverHaircareSection />
        <AnimatedTwoImageSection />
        <AnimatedCommixIconicsSection />
        <FullWidthImageSection />
        <AnimatedExclusiveFestiveCombosSection />
        <AnimatedOfferSection />
        <AnimatedFeaturedSection />
        <AnimatedBlogSection />
      </section>
    </>
  );
};

export default MainSection;