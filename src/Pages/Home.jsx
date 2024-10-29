import React, { useRef, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer.jsx';
import MainSection from '../Components/MainSection.jsx';
import Touch from '../Components/Touch';
import FallingElements from '../Components/Alum/FallingElements';
import taImageSrc from '../Assets/Image/—Pngtree—3d cute small robot on_17775821.png'; // Import your TA image

const Home = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.minHeight = `${window.innerHeight}px`;
    }
  }, []);

  return (
    <>
      <Header/>
      <div ref={contentRef} style={{ position: 'relative', overflow: 'hidden' }}>
        <FallingElements count={30} imageSrc={taImageSrc} />
        <MainSection/>
        <Touch/>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
