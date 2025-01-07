import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCircle, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/ProductDetail/ProductDropdownInfo.scss';
import { API_URL } from '../../config/api';

const formatArrayField = (field) => {
  if (!field) return '';
  
  if (typeof field === 'string') {
    return field
      .replace(/[\[\]"]/g, '')
      .split(',')
      .map(item => item.trim())
      .join(', ');
  }
  
  if (Array.isArray(field)) {
    return field.join(', ');
  }
  
  return '';
};

const DropdownSection = ({ title, content, isOpen, toggleOpen, rating, reviewCount }) => (
  <div className={`dropdown-section ${isOpen ? 'open' : ''}`}>
    <div className="dropdown-header" onClick={toggleOpen}>
      <h3 className="dropdown-title">
        <FontAwesomeIcon icon={faCircle} className="bullet-icon" />
        {title}
        {rating && reviewCount && (
          <span className="rating-info">
            <FontAwesomeIcon icon={faStar} className="star-icon" />
            {rating} ({reviewCount})
          </span>
        )}
      </h3>
      <FontAwesomeIcon 
        icon={faChevronDown} 
        className={`dropdown-icon ${isOpen ? 'open' : ''}`} 
      />
    </div>
    {isOpen && <div className="dropdown-content">{content}</div>}
  </div>
);

const ReviewSection = ({ reviews, currentPage, totalPages, onPageChange }) => {
  console.log('Reviews in ReviewSection:', reviews); // Keep this for debugging

  return (
    <div className="reviews-section">
      {reviews.map((review, index) => (
        <div key={index} className="review-item">
          <div className="review-header">
            <h4 className="reviewer-name">
              <FontAwesomeIcon icon={faUser} className="user-icon" />
              <span className="name">{review.user_name || review.user_id?.name || 'Anonymous'}</span>
            </h4>
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={i < review.rating ? "star-filled" : "star-empty"}
                />
              ))}
            </div>
          </div>
          <p className="review-text">{review.comment}</p>
          {review.photo_urls && review.photo_urls.length > 0 && (
            <div className="review-photos">
              {review.photo_urls.map((url, photoIndex) => (
                <img key={photoIndex} src={url} alt={`Review photo ${photoIndex + 1}`} className="review-photo" />
              ))}
            </div>
          )}
        </div>
      ))}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const ProductDropdownInfo = ({ description, ingredients, faqs, additionalDetails, productId }) => {
  const [openSection, setOpenSection] = useState('');
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      console.log('Fetching initial reviews');
      fetchReviews(1);
    }
  }, [productId]);

  const toggleSection = (section) => {
    console.log('Toggling section:', section);
    setOpenSection(prevSection => prevSection === section ? '' : section);
  };

  const fetchReviews = async (page) => {
    console.log('Fetching reviews for page:', page);
    setIsLoading(true);
    setError(null);
    try {
      if (!productId) {
        throw new Error('Product ID is missing');
      }
      const url = `${API_URL}/reviews/product/${productId}/reviews?page=${page}&limit=5`;
      console.log('Fetching reviews from URL:', url);
      const response = await axios.get(url);
      console.log('Reviews response:', response.data);
      
      // Transform the reviews data to ensure user_name is available
      const transformedReviews = response.data.reviews.map(review => ({
        ...review,
        user_name: review.user_name || review.user_id?.name || 'Anonymous'
      }));
      
      setReviews(transformedReviews);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setReviewCount(response.data.totalReviews);
      if (transformedReviews.length > 0) {
        const avgRating = transformedReviews.reduce((acc, review) => acc + review.rating, 0) / transformedReviews.length;
        setAverageRating(avgRating.toFixed(1));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error.message || 'Failed to fetch reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    console.log('Changing to page:', newPage);
    fetchReviews(newPage);
  };

  console.log('Current state:', { openSection, reviews, isLoading, error });

  const ReviewsDropdownSection = () => (
    <DropdownSection
      title="REVIEWS"
      content={
        !productId ? (
          <p>Reviews are not available for this product.</p>
        ) : isLoading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p>{error}</p>
        ) : reviews.length === 0 ? (
          <p>No reviews available for this product.</p>
        ) : (
          <ReviewSection
            reviews={reviews}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )
      }
      isOpen={openSection === 'reviews'}
      toggleOpen={() => toggleSection('reviews')}
      rating={reviewCount > 0 ? averageRating : null}
      reviewCount={reviewCount > 0 ? reviewCount : null}
    />
  );

  return (
    <div className="product-dropdown-info">
      <DropdownSection
        title="DESCRIPTION"
        content={<p>{description}</p>}
        isOpen={openSection === 'description'}
        toggleOpen={() => toggleSection('description')}
      />
      <DropdownSection
        title="INGREDIENTS"
        content={<p>{formatArrayField(ingredients)}</p>}
        isOpen={openSection === 'ingredients'}
        toggleOpen={() => toggleSection('ingredients')}
      />
      <DropdownSection
        title="FREQUENTLY ASKED QUESTIONS"
        content={
          <ul>
            {faqs.map((faq, index) => (
              <li key={index}>
                <strong>Q: {faq.question}</strong>
                <p>A: {faq.answer}</p>
              </li>
            ))}
          </ul>
        }
        isOpen={openSection === 'faqs'}
        toggleOpen={() => toggleSection('faqs')}
      />
      <DropdownSection
        title="ADDITIONAL DETAILS"
        content={<p>{additionalDetails}</p>}
        isOpen={openSection === 'additionalDetails'}
        toggleOpen={() => toggleSection('additionalDetails')}
      />
      <ReviewsDropdownSection />
    </div>
  );
};

export default ProductDropdownInfo;
