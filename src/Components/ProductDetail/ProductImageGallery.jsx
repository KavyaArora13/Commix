import React, { useState } from 'react';
import '../../Assets/Css/ProductDetail/ProductImageGallery.scss';

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="product-image-gallery d-flex flex-row align-items-center">
      
      {/* Thumbnails */}
      <div className="thumbnail-container d-flex flex-column me-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${image === selectedImage ? 'active' : ''}`}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="img-fluid" />
          </div>
        ))}
      </div>

      {/* Main Selected Image */}
      <div className="selected-image mb-3">
        <img src={selectedImage} alt="Selected product" className="img-fluid" />
      </div>

    </div>
  );
};

export default ProductImageGallery;
