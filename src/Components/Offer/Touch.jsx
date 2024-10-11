import React from 'react';
import '../../Assets/Css/Offer/Touch.scss'

const Touch = () => {
  return (
    <section className='touch-subscribe-section'>
      <div className='touch-heading-container'>
        <img src={require('../../Assets/Image/bloomLeft.png')} alt="Flower Icon" className='touch-decor-icon touch-left-icon'/>
        <h2 className='touch-section-heading'>
          <span className='touch-decor-line'>LET'S STAY IN TOUCH</span>
        </h2>
        <img src={require('../../Assets/Image/bloomRight.png')} alt="Flower Icon" className='touch-decor-icon touch-right-icon'/>
      </div>

      <p className='touch-section-description'>
        Get The Latest Beauty Tips Straight To Your Inbox. Can't Wait To Connect
      </p>

      <div className='touch-subscribe-form'>
        <input type="email" placeholder='Enter Email' className='touch-email-input'/>
        <button className='touch-subscribe-button'>SUBSCRIBE</button>
      </div>
    </section>
  );
};

export default Touch;
