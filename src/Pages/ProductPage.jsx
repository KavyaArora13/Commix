import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Banner from '../Components/ProductPage/Banner';
import SearchBar from '../Components/ProductPage/SearchBar';
import ProductGridLayout from '../Components/ProductPage/ProductGridLayout'; 

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <div className="product-page">
      <Header />

      <div className="container">
        <Banner />
        <SearchBar searchTerm={searchTerm} handleSearch={setSearchTerm} />
        <ProductGridLayout searchTerm={searchTerm} />
      </div>

      <Footer />
    </div>
  );
}

export default ProductPage;
