import React, { useState, useEffect } from 'react';
import ProductFilters from './ProductFilters'; // Import the ProductFilters component
import ProductCard from './ProductCard'; // Import the ProductCard component
import CardComponent from './CardComponent';
import '../../Assets/Css/ProductPage/ProductGridLayout.scss';
import axios from 'axios'; // Import axios for API calls
import { API_URL } from '../../config/api';

const itemsPerPage = 9;

const ProductGridLayout = ({ searchTerm }) => {
  const [products, setProducts] = useState([]); // State to hold products
  const [bestSellers, setBestSellers] = useState([]); // State to hold best sellers
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`); // Adjust the endpoint as necessary
        // Ensure the response contains products
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
        // Ensure the response contains best sellers
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

  if (loading) return <p>Loading products...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error state

  return (
    <div className="product-grid-layout container mt-5">
      <div className="row">
        {/* Left Section */}
        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-3 col-12">
          <ProductFilters />
        </div>

        {/* Right Section */}
        <div className="col-sm-12 col-md-12 col-lg-8 col-xl-9 col-12">
          <div className="result-header mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="result-count">
                <p>Showing all {filteredProducts.length} results</p>
              </div>
              <div className="sort-by dropdown">
                <button
                  className="btn btn-dark dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Recommendation
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li><a className="dropdown-item" href="#">List Dropdown 1</a></li>
                  <li><a className="dropdown-item" href="#">List Dropdown 2</a></li>
                  <li><a className="dropdown-item" href="#">List Dropdown 3</a></li>
                  <li><a className="dropdown-item" href="#">List Dropdown 4</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
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
          <button className="btn btn-dark view-all-button">VIEW ALL</button>
        </div>
      </div>
      <div className='row mt-4'>
        {bestSellers.map((product) =>(
          <CardComponent
          key={product._id}
          image={product.image_urls[0]} // Adjusted to use the correct image field
          title={product.name}
          price={product.price}
          description={product.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGridLayout;