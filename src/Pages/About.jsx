import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import SectionTitle from '../Components/SectionTitle';
import AboutContent from '../Components/About/AboutContent';
import Quote from '../Components/About/Quote';
import OwnerShowcase from '../Components/About/OwnerShowcase';
import Touch from '../Components/Touch';

const About = () => {
  return <>
    <Header/>
    <SectionTitle title="About Us"/>
    <AboutContent/>
    <OwnerShowcase/>
    <Quote/>
    <Touch/>
    <Footer/>
  </>;
};

export default About;