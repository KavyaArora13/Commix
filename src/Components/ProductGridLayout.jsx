import React, { useState, useEffect } from 'react';
import ProductFilters from './ProductFilters'; // Import the ProductFilters component
import ProductCard from './ProductCard'; // Import the ProductCard component
import CardComponent from './CardComponent';
import '../../Assets/Css/ProductPage/ProductGridLayout.scss';
import axios from 'axios'; // Import axios for API calls
import { API_URL } from '../../config/api';
import MobileFilter from './MobileFilter';


const itemsPerPage = 9;
const ProductGridLayout = ({ searchTerm, sortOption, setSortOption }) => {
  const [products, setProducts] = useState([]); // State to hold products
  const [bestSellers, setBestSellers] = useState([]); // State to hold best sellers
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`); // Adjust the endpoint as necessary
        if (response.data.success) {
          setProducts(Array.isArray(response.data.products) ? response.data.products : []);
        } else {
          setError('Failed to fetch products');
        }
        console.log('Fetched products:', response.data); // Log the response
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`); // Use the same endpoint for best sellers
        if (response.data.success) {
          setBestSellers(Array.isArray(response.data.products) ? response.data.products : []);
        } else {
          setError('Failed to fetch best sellers');
        }
        console.log('Fetched best sellers:', response.data); // Log the response
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setError('Failed to fetch best sellers');
      }
    };

    fetchProducts();
    fetchBestSellers();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const filteredProducts = searchTerm.trim() === ''
    ? products
    : products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to sort products based on the selected option
  const sortProducts = (products) => {
    switch (sortOption) {
      case 'AtoZ':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'ZtoA':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case 'priceLowToHigh':
        return products.sort((a, b) => a.variants[0].price - b.variants[0].price);
      case 'priceHighToLow':
        return products.sort((a, b) => b.variants[0].price - a.variants[0].price);
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(filteredProducts);

  if (loading) return <p>Loading products...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error state

  return (
    <div className="product-grid-layout container mt-5">
      <div className="row">
        {/* Left Section */}
        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-3 col-12">
          <ProductFilters />
        </div>
        <MobileFilter sortOption={sortOption} setSortOption={setSortOption} />
        {/* Right Section */}
        <div className="col-sm-12 col-md-12 col-lg-8 col-xl-9 col-12">
          <div className="result-header mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="result-count">
                <p>Showing all {filteredProducts.length} results</p>
              </div>
              <div className="sort-by dropdown">
                <select 
                  id="sortOptions" 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)} // Use setSortOption here
                  className="btn btn-dark dropdown-toggle"
                >
                  <option value="" disabled>Sort By</option> {/* "Sort By" will be shown initially but disabled */}
                  <option value="AtoZ">A to Z</option>
                  <option value="ZtoA">Z to A</option>
                  <option value="priceLowToHigh">Price Low to High</option>
                  <option value="priceHighToLow">Price High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div className="col-6 col-md-4 col-lg-4" key={product._id}> {/* Ensure proper column classes */}
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>

          <nav>
            <ul className="pagination justify-content-center ">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handlePreviousPage}>
                  &laquo;
                </button>
              </li>
              {[...Array(totalPages).keys()].map((num) => (
                <li
                  key={num + 1}
                  className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(num + 1)}>
                    {num + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handleNextPage}>
                   &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-10 col-md-9 col-sm-12">
          <p className="section-subtitle">
            Top Seller
          </p>
          <h2 className="section-title">
            Explore Our Best Collections
          </h2>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-12 d-flex justify-content-end align-items-center">
        </div>
      </div>
      <div className='row mt-4'>
        {bestSellers.map((product) => (
          <CardComponent
            key={product._id}
            image={product.image_urls[0]}
            title={product.name}
            price={product.variants && product.variants.length > 0 ? product.variants[0].price : 'N/A'}
            description={product.description}
            slug={product.slug}
            category={product.category}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGridLayout;