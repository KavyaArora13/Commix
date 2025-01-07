import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../Assets/Css/Cart/RecommendedProduct.scss';
import axios from 'axios';
import { API_URL } from '../../config/api'; // Ensure you have the correct API URL

const RecommendedProduct = ({ product }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `${API_URL}/reviews/product/${product._id}/reviews?page=1&limit=5`; // Adjust the URL as needed
        const response = await axios.get(url);
        const reviews = response.data.reviews;

        if (reviews.length > 0) {
          const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
          setAverageRating(avgRating.toFixed(1));
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to fetch reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [product._id]); // Fetch reviews when the product ID changes

  // Check if variants exist and have at least one variant
  const price = product.variants && product.variants.length > 0 
    ? product.variants[0].price.toFixed(2) 
    : 'N/A'; // Fallback value if no variants are available

  return (
    <div className="recommended-product d-flex align-items-center mb-2 p-2 border">
      <div className="product-image me-3" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
        <img 
          src={product.image_urls[0] || 'placeholder-image-url'} 
          alt={product.name} 
          className="img-fluid" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="product-details flex-grow-1">
        <h6 className="product-title mb-1" style={{ fontSize: '0.9rem' }}>{product.name}</h6>
        <div className="product-rating mb-1" style={{ fontSize: '0.8rem' }}>
          {isLoading ? (
            <span>Loading...</span>
          ) : error ? (
            <span>{error}</span>
          ) : (
            [...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < Math.round(averageRating) ? 'gold' : 'lightgray' }}>★</span>
            ))
          )}
          <span className="ms-1">{averageRating > 0 ? averageRating : 'NA'}</span>
        </div>
        <p className="product-price mb-1" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Rs: {price}</p>
        <Link to={`/product/${product.slug}`} className="btn btn-sm btn-warning" style={{ fontSize: '0.8rem' }}>View Product</Link>
      </div>
    </div>
  );
};

export default RecommendedProduct;
