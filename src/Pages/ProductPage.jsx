import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Banner from '../Components/ProductPage/Banner';
import SearchBar from '../Components/ProductPage/SearchBar';
import ProductGridLayout from '../Components/ProductPage/ProductGridLayout'; 
import Touch from '../Components/Touch';

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [sortOption, setSortOption] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      console.log('Fetched products:', response.data.products); // Add this line
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  
  return (
    <div className="product-page">
      <Header />
      <div className="container">
        <Banner />
        <SearchBar searchTerm={searchTerm} handleSearch={setSearchTerm} />
        
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ProductGridLayout 
            products={products}
            searchTerm={searchTerm} 
            sortOption={sortOption} 
            setSortOption={setSortOption}
          />
        )}
      </div>
      <Touch/>
      <Footer />
    </div>
  );
}

export default ProductPage;
