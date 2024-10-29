import React, { useState } from 'react';
import '../../Assets/Css/ProductDetail/ProductImageGallery.scss';

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="product-image-gallery">
      <div className="gallery-container">
        <div className="left-thumbnails">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${image === selectedImage ? 'active' : ''}`}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="main-image-container">
          <img src={selectedImage} alt="Selected product" className="main-image" />
        </div>
        <div className="bottom-thumbnails">
          {images.length > 3 && (
            <div
              className={`thumbnail ${images[3] === selectedImage ? 'active' : ''}`}
              onClick={() => setSelectedImage(images[3])}
            >
              <img src={images[3]} alt="Corner Thumbnail" />
            </div>
          )}
          {images.slice(4).map((image, index) => (
            <div
              key={index + 4}
              className={`thumbnail ${image === selectedImage ? 'active' : ''}`}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt={`Thumbnail ${index + 5}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;