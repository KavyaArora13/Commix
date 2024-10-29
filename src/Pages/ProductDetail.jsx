// src/Pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Assets/Css/ProductDetail/ProductDetail.scss';
import ProductImageGallery from '../Components/ProductDetail/ProductImageGallery.jsx';
import ProductDetailInfo from '../Components/ProductDetail/ProductDetailInfo';
import ProductDropdownInfo from '../Components/ProductDetail/ProductDropdownInfo';
import CardComponent from '../Components/ProductPage/CardComponent';
import SectionTitle from '../Components/SectionTitle';
import ImageComparisonSlider from '../Components/ProductDetail/ImageComparisonSlider';
import { API_URL } from '../config/api';
import afterImage from '../Assets/Image/after.jpeg'
import beforeImage from '../Assets/Image/before.jpeg'
import Touch from '../Components/Touch';
const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyVisited, setRecentlyVisited] = useState([]);

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

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-page">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-lg-6 col-md-6 col-sm-12">
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
          <div className="col-xl-7 col-lg-6 col-md-6 col-sm-12">
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

        {recentlyVisited.length > 0 && (
          <>
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
          </>
        )}
      </div>
      <Touch/>
      <Footer />
    </div>
  );
};

export default ProductDetail;
