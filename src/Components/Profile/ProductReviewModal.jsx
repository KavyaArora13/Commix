import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // or your preferred modal library
import ReactStars from "react-rating-stars-component";
import axios from 'axios'; // Make sure to install and import axios
import '../../Assets/Css/Profile/ProductReviewModal.scss';
import { API_URL } from '../../config/api';

// Make sure to set the app element for accessibility
Modal.setAppElement('#root');

const toggleBodyScroll = (disable) => {
  if (disable) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
};

const ProductReviewModal = ({ isOpen, onClose, product, user, onSubmit }) => {
  console.log('ProductReviewModal rendered. isOpen:', isOpen);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  console.log('ProductReviewModal user:', user);
  console.log('ProductReviewModal product:', product);

  useEffect(() => {
    console.log('ProductReviewModal useEffect - isOpen:', isOpen);
    console.log('ProductReviewModal useEffect - user:', user);
    console.log('ProductReviewModal useEffect - product:', product);
    toggleBodyScroll(isOpen);
    return () => {
      toggleBodyScroll(false);
    };
  }, [isOpen, user, product]);

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('User information is missing. Please log in and try again.');
      console.error('User object is undefined or null');
      return;
    }

    const userId = user._id || user.id;
    if (!userId) {
      setError('User ID is missing. Please log in and try again.');
      console.error('User object does not have an id or _id property:', user);
      return;
    }

    if (!product || !product.id) {
      setError('Product information is missing. Please try again.');
      console.error('Product object is undefined or missing id:', product);
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('product_id', product.id);
    formData.append('comment', review);
    formData.append('rating', rating);

    // Change this part to append multiple photos
    images.forEach((image, index) => {
      formData.append('photos', image);
    });

    try {
      const response = await axios.post(`${API_URL}/reviews/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSubmit(response.data.review);
      toggleBodyScroll(false);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('An error occurred while submitting your review. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files].slice(0, 5)); // Limit to 5 images
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const handleClose = () => {
    toggleBodyScroll(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Product Review Modal"
      className="review-modal"
      overlayClassName="review-modal-overlay"
      style={{
        overlay: { 
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        content: { 
          zIndex: 10000,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          background: 'white',
          color: 'black',
          padding: '20px',
          width: '80%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
        }
      }}
    >
      <h2 className="review-modal__title">Write a Review for {product.name}</h2>
      {error && <div className="review-modal__error">{error}</div>}
      <form onSubmit={handleSubmit} className="review-modal__form">
        <div className="review-modal__rating">
          <ReactStars
            count={5}
            onChange={ratingChanged}
            size={40}
            isHalf={true}
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt"></i>}
            fullIcon={<i className="fa fa-star"></i>}
            activeColor="#EABE67"
          />
        </div>
        <p className="review-modal__rating-text">Your rating: {rating} stars</p>
        <textarea
          className="review-modal__textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <div className="review-modal__image-upload">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            id="image-upload"
            multiple
            className="review-modal__file-input"
          />
          <label htmlFor="image-upload" className="review-modal__upload-button">Upload Image</label>
        </div>
        <div className="review-modal__image-preview">
          {images.map((image, index) => (
            <div key={index} className="review-modal__image-item">
              <img src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} />
              <button type="button" onClick={() => removeImage(index)} className="review-modal__remove-image">Remove</button>
            </div>
          ))}
        </div>
        <div className="review-modal__actions">
          <button type="submit" className="review-modal__submit">Submit Review</button>
          <button type="button" onClick={handleClose} className="review-modal__cancel">Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductReviewModal;
