import React,{useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Offer/CouponCard.scss';

const CouponCard = ({ imageSrc, couponCode }) => {
  const [copied,setCopied] = useState(false);  

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() =>{
            setCopied(false);
        },2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div className="card p-2">
        <div className="card-body p-0">
          <img src={imageSrc} alt="Card Image" className="card-img-top" />
          <div className="coupon-section p-2">
            <div className="coupon-text p-2">
              {couponCode} {/* Display the couponCode dynamically */}
            </div>
            <div className="icon1 p-2" onClick={() => copyToClipboard(couponCode)}>
              {/* Using FontAwesome for the copy icon */}
              <FontAwesomeIcon icon={faCopy} />
              {copied && <span className="copied-tooltip p-2">Copied!</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
