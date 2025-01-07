// src/Pages/ProductDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Assets/Css/ProductDetail/ProductDetail.scss';
import ProductImageGallery from '../Components/ProductDetail/ProductImageGallery.jsx';
import MobileImageSlider from '../Components/ProductDetail/MobileImageSlider';
import ProductDetailInfo from '../Components/ProductDetail/ProductDetailInfo';
import ProductDropdownInfo from '../Components/ProductDetail/ProductDropdownInfo';
import CardComponent from '../Components/ProductPage/CardComponent';
import SectionTitle from '../Components/SectionTitle';
import ImageComparisonSlider from '../Components/ProductDetail/ImageComparisonSlider';
import { API_URL } from '../config/api';
import afterImage from '../Assets/Image/after.jpeg';
import beforeImage from '../Assets/Image/before.jpeg';
import Touch from '../Components/Touch';
import { IoArrowBack } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";



const ProductDetail = () => {
  const { slug } = useParams();
  const productDetailRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product details...');
        const response = await axios.get(`${API_URL}/products/details/${slug}`);
        if (response.data.success) {
          console.log('Product details fetched successfully:', response.data.product);
          setProduct(response.data.product);
          await trackProductVisit(response.data.product);
        } else {
          console.error('Failed to fetch product details');
          setError('Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An error occurred while fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const trackProductVisit = async (product) => {
    console.log('Tracking product visit...');
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('User data:', userData);

    if (userData && userData.user && userData.user.id && product) {
      try {
        const response = await axios.post(`${API_URL}/products/trackProduct`, {
          productId: product._id,
          productName: product.name,
          userId: userData.user.id
        });
        console.log('Product visit tracked successfully:', response.data);
      } catch (err) {
        console.error('Error tracking product visit:', err);
      }
    } else {
      console.log('User not logged in or product information missing, skipping visit tracking');
    }
  };

  useEffect(() => {
    const fetchRecentlyVisited = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User data for recently visited:', user);

      if (user && user.user && user.user.id) {
        try {
          console.log('Fetching recently visited products...');
          const response = await axios.get(`${API_URL}/products/recentlyVisited/${user.user.id}`);
          console.log('Recently visited products fetched successfully:', response.data);

          const filteredVisits = response.data.productVisits
            .filter(visit => visit.productId._id !== product?._id)
            .reduce((acc, current) => {
              const x = acc.find(item => item.productId._id === current.productId._id);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);

          setRecentlyVisited(filteredVisits);
        } catch (err) {
          console.error('Error fetching recently visited products:', err);
        }
      } else {
        console.log('User is not logged in, skipping recently visited products');
      }
    };

    fetchRecentlyVisited();
  }, [product]);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className={`product-detail-page ${isMobile ? 'mobile-view' : ''}`}>
      {!isMobile && <Header />}
      <div className="container">
        {isMobile ? (
          <>
            <div className="mobile-product-header">
              <button className="back-button" onClick={handleBack}>
                <IoArrowBack />
              </button>
              <h1>{product.name}</h1>
            </div>
            
            <div className="mobile-product-content">
              <MobileImageSlider images={product.image_urls} />
              <ProductDetailInfo 
                product={product} 
                ref={productDetailRef}
                isMobile={isMobile}
              />
              <ProductDropdownInfo
                description={product.description}
                ingredients={product.ingredients}
                faqs={product.faqs || []}
                additionalDetails={product.additionalDetails}
                productId={product._id}
              />
              <div className="mobile-before-after">
                <h2>Before and After</h2>
                <ImageComparisonSlider 
                  beforeImage={beforeImage}
                  afterImage={afterImage}
                  height="300px"
                />
              </div>
              {recentlyVisited.length > 0 && (
                <div className="recently-viewed">
                  <SectionTitle title="SHOP FROM RECENTLY VIEWED" />
                  <div className="row mt-5 mb-5">
                    {recentlyVisited.map((visit) => (
                      <CardComponent
                        key={visit.productId._id}
                        image={visit.productId.image_urls[0]}
                        title={visit.productId.name}
                        price={`$${visit.productId.price}`}
                        description={visit.productId.description}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          
            <div className="mobile-fixed-bottom">
              <button 
                className="wishlist-btn"
                onClick={() => productDetailRef.current?.handleToggleFavorite()}
              >
                <FaHeart className={productDetailRef.current?.isFavorite ? 'active' : ''} />
              </button>
              <button 
                className="add-to-bag-btn"
                onClick={() => productDetailRef.current?.handleAddToBag()}
                disabled={productDetailRef.current?.isAddingToCart}
              >
                {productDetailRef.current?.isAddingToCart ? 'Adding...' : 'Add to Bag'}
              </button>
            </div>
          </>
        ) : (
          <div className="row">
            {/* Product Images Section */}
            <div className="col-xl-5 col-lg-6 col-md-12 col-sm-12">
              {/* Desktop/iPad Image Gallery (visible from 768px up) */}
              <div className="d-none d-md-block">
                <ProductImageGallery images={product.image_urls} />
                <div className="image-comparison-container">
                  <h2 className='kavya'>Before and After</h2>
                  <ImageComparisonSlider 
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                    height="400px"
                  />
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12">
              <ProductDetailInfo product={product} />
              <ProductDropdownInfo
                description={product.description}
                ingredients={product.ingredients}
                faqs={product.faqs || []}
                additionalDetails={product.additionalDetails}
                productId={product._id}
              />
            </div>
          </div>
        )}
      </div>
      {!isMobile && (
        <>
          <Touch />
          <Footer />
        </>
      )}
    </div>
  );
};

export default ProductDetail;
