import React from 'react';
import { Link } from 'react-router-dom';
import '../../Assets/Css/ProductPage/CardComponent.scss';

const CardComponent = ({ image, title, price, description, slug }) => {
  return (
    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 mb-4">
      <div className="card h-100 border-0">
        <Link to={`/product/${slug}`} className="card-link">
          <img
            src={image}
            className="card-img-top1 card-image" // Added class for image styling
            alt={title}
          />
        </Link>
        <div className="card-body text-left d-flex justify-content-between align-items-center">
          <h5 className="card-title">{title}</h5>
          <button className="price-button p-0.5">Rs: {price}</button>
        </div>
        <div className="card-body text-left">
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
