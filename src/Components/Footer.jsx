import React from 'react';
import { Link } from 'react-router-dom'; 
import '../Assets/Css/Footer.scss';
import SocialIcon from './SocialIcon';
import { faInstagram, faFacebookF, faTwitter, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const footerLinks = [
    { name: 'Stores', link: '/stores' },
    { name: 'Elite', link: '/elite' },
    { name: 'Terms & Conditions', link: '/terms' },
    { name: 'Returns', link: '/returns' },
    { name: 'FAQ', link: '/faq' },
    { name: 'About Us', link: '/about' }
  ];

  return (
    <footer className="footer">
      {/* Footer Top Section */}
      <div className="footer-top text-center">
        <div className="rounded-logo">
          <img src='./images/logo.gif' alt="Top logo" className="footer-logo " />
        </div>
      </div>

      {/* Social Links Section */}
      <div className="footer-social-links row justify-content-center gap-3 mt-3 w-100">
        <div className="col-auto">
          <SocialIcon icon={faInstagram} link="https://instagram.com" />
        </div>
        <div className="col-auto">
          <SocialIcon icon={faFacebookF} link="https://facebook.com" />
        </div>
        <div className="col-auto">
          <SocialIcon icon={faTwitter} link="https://twitter.com" />
        </div>
        <div className="col-auto">
          <SocialIcon icon={faLinkedinIn} link="https://linkedin.com" />
        </div>
        <div className="col-auto">
          <SocialIcon icon={faYoutube} link="https://youtube.com" />
        </div>
        <div className="col-auto">
          <SocialIcon icon={faEnvelope} link="mailto:hello@commic.com" />
        </div>
      </div>

      <div className="footer-divider my-3"></div>

      {/* Footer Links Section */}
      <div className="footer-links d-flex flex-wrap justify-content-center">
        {footerLinks.map((footerItem, index) => (
          <Link key={index} to={footerItem.link} className="footer-link-item mx-3">
            {footerItem.name}
          </Link>
        ))}
      </div>

      <div className="footer-divider my-3"></div>

      {/* Get in Touch Section */}
      <div className="footer-header text-start my-3">
        <h1>GET IN TOUCH</h1>
      </div>

      {/* Footer Content Section */}
      <div className="footer-content d-flex flex-wrap justify-content-between text-center text-md-left">
        <div className="footer-column mb-3">
          <p>Call us at</p>
          <div className="divider-line"></div> {/* Divider line between Call us at and phone number */}
          <p>
            79319324298<br />
            <span className="timing-line">Monday to Friday: 09:00AM - 09:00PM</span><br />
            <span className="timing-line">Saturday: 09:00AM - 06:00PM</span>
          </p>
        </div>

        <div className="footer-column mb-3">
          <h4>Support</h4>
          <a href="mailto:hello@commic.com">hello@commic.com</a>
        </div>

        <div className="footer-column mb-3">
          <h4>Careers</h4>
          <Link to="/career">We’re hiring!</Link>
        </div>

        <div className="footer-column mb-3">
          <h4>PR Inquiries</h4>
          <a href="mailto:pr@commix.com">pr@commix.com</a>
        </div>

        <div className="footer-column mb-3">
          <h4>Influencer collab</h4>
          <Link to="/collab">Join Us</Link>
        </div>
      </div>

      <div className="footer-divider my-3"></div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom text-center py-3">
        <p>Copyright@2024 Commic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;