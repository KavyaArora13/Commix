import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Assets/Css/ProductDetail/ProductDetail.scss';
import ProductImageGallery from '../Components/ProductDetail/ProductImageGallery.jsx';
import ProductDetailInfo from '../Components/ProductDetail/ProductDetailInfo';
import { API_URL } from '../config/api';

const ProductDetail = () => {
  const { slug } = useParams(); // Get the product slug from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch the product by slug
        const response = await axios.get(`${API_URL}/products/details/${slug}`);
        if (response.data.success) {
          setProduct(response.data.product);
          trackProductVisit(response.data.product);
        } else {
          setError('Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An error occurred while fetching product details');
      } finally {
        setLoading(false);
      }
    };

    const trackProductVisit = async (product) => {
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
      if (user && user.id) {
        try {
          await axios.post(`${API_URL}/products/trackProduct`, {
            productId: product._id,
            productName: product.name,
            userId: user.id
          });
        } catch (err) {
          console.error('Error tracking product visit:', err);
        }
      }
    };

    fetchProduct();
  }, [slug]); // Include 'slug' in the dependency array

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-page">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
            <ProductImageGallery images={product.image_urls} />
          </div>
          <div className="col-xl-8 col-lg-6 col-md-6 col-sm-12">
            <ProductDetailInfo product={product} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;