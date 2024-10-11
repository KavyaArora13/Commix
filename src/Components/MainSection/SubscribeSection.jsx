import React from 'react';

const SubscribeSection = () => {
  return (
    <section className='subscribe-section'>
      <div className='heading-container'>
        <img src={require('../../Assets/Image/bloomLeft.png')} alt="Flower Icon" className='decor-icon left-icon'/>
        <h2 className='section-heading'>
          <span className='decor-line'>LET'S STAY IN TOUCH</span>
        </h2>
        <img src={require('../../Assets/Image/bloomRight.png')} alt="Flower Icon" className='decor-icon right-icon'/>
      </div>

      <p className='section-description'>
        Get The Latest Beauty Tips Straight To Your Inbox. Can't Wait To Connect
      </p>

      <div className='subscribe-form'>
        <input type="email" placeholder='Enter Email' className='email-input'/>
        <button className='subscribe-button'>SUBSCRIBE</button>
      </div>
    </section>
  );
};

export default SubscribeSection;