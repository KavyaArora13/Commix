// src/Components/Admin/ProductsContent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaEdit, FaBan, FaEye, FaPlus, FaArrowLeft, FaCheck } from 'react-icons/fa';
import AddProductForm from './AddProductForm';
import '../../Assets/Css/Admin/ProductContent.scss';

const ProductsContent = ({ onEditProduct, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?populate=category,subcategory`);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    fetchProducts();
  };

  const handleToggleBlockStatus = async (productId) => {
    try {
      const productToUpdate = products.find(p => p._id === productId);
      const newStatus = !productToUpdate.isBlocked;
      
      await axios.patch(`${API_URL}/products/block/${productId}`, { isBlocked: newStatus });
      
      setProducts(prevProducts => 
        prevProducts.map(p => p._id === productId ? { ...p, isBlocked: newStatus } : p)
      );
    } catch (error) {
      console.error('Error updating product status:', error);
      setError('Failed to update product status. Please try again.');
    }
  };

  const handleView = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      setSelectedProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const getCategoryName = (product) => {
    if (product.category_id && typeof product.category_id === 'object' && product.category_id.name) {
      return product.category_id.name;
    } else if (product.category && typeof product.category === 'object' && product.category.name) {
      return product.category.name;
    } else {
      return 'N/A';
    }
  };

  const getSubcategoryName = (product) => {
    if (product.subcategory_id && typeof product.subcategory_id === 'object' && product.subcategory_id.name) {
      return product.subcategory_id.name;
    } else if (product.subcategory && typeof product.subcategory === 'object' && product.subcategory.name) {
      return product.subcategory.name;
    } else {
      return 'N/A';
    }
  };

  // Helper function to format array fields without quotes and brackets
  const formatArrayField = (field) => {
    if (!field) return '';
    
    // If it's already a string, remove all quotes and brackets
    if (typeof field === 'string') {
      // Remove all quotes, brackets, and extra spaces
      return field
        .replace(/[\[\]"]/g, '') // Remove brackets and quotes
        .split(',')
        .map(item => item.trim())
        .join(', ');
    }
    
    // If it's an array, just join with commas
    if (Array.isArray(field)) {
      return field.join(', ');
    }
    
    return '';
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  if (selectedProduct) {
    return (
      <div className="product-details">
        <button onClick={handleBack} className="back-button">
          <FaArrowLeft /> Back to Products
        </button>
        <h2>{selectedProduct.name}</h2>
        
        <div className="product-images">
          <div className="image-grid">
            {selectedProduct.image_urls.map((url, index) => (
              <img key={index} src={url} alt={`Product ${index + 1}`} />
            ))}
          </div>
        </div>
  
        <div className="product-info">
          <p><strong>Category:</strong> {getCategoryName(selectedProduct)}</p>
          <p><strong>Subcategory:</strong> {getSubcategoryName(selectedProduct)}</p>
          <p><strong>Description:</strong> {selectedProduct.description || ''}</p>
          <p><strong>Ingredients:</strong> {formatArrayField(selectedProduct.ingredients)}</p>
          <p><strong>Hero Ingredients:</strong> {formatArrayField(selectedProduct.hero_ingredients)}</p>
          <p><strong>Functions:</strong> {formatArrayField(selectedProduct.functions)}</p>
          <p><strong>Taglines:</strong> {formatArrayField(selectedProduct.taglines)}</p>
          <p><strong>Variants & Prices:</strong></p>
          <ul className="variant-list">
            {selectedProduct.variants?.map((variant, index) => (
              <li key={index}>
                {variant.name}: ₹{variant.price} - Stock: {variant.stock_quantity}
              </li>
            ))}
          </ul>
          <p><strong>Rating:</strong> {selectedProduct.rating || 0}</p>
          <p><strong>Status:</strong> {selectedProduct.isBlocked ? 'Inactive' : 'Active'}</p>
          <p><strong>Sales:</strong> {selectedProduct.sales || 0}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card relative">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <p className="mb-4">Manage your product catalog here.</p>
      <button 
        onClick={handleAddProduct} 
        className="add-product-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        <FaPlus className="inline-block mr-2" /> Add New Product
      </button>

      {isAddFormOpen && (
        <AddProductForm onClose={handleCloseAddForm} />
      )}

      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Subcategory</th>
            <th className="px-4 py-2">Variants & Prices</th>
            <th className="px-4 py-2">Sizes</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{getCategoryName(product)}</td>
              <td className="border px-4 py-2">{getSubcategoryName(product)}</td>
              <td className="border px-4 py-2">
                {product.variants.map(v => `${v.name}: ₹${v.price}`).join(', ')}
              </td>
              <td className="border px-4 py-2">
                {product.variants.map(v => v.name).join(', ')}
              </td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 rounded ${product.isBlocked ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {product.isBlocked ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => handleView(product._id)} title="View" className="mr-2 text-blue-500 hover:text-blue-700">
                  <FaEye />
                </button>
                <button onClick={() => onEditProduct(product)} title="Edit" className="mr-2 text-green-500 hover:text-green-700">
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleToggleBlockStatus(product._id)} 
                  title={product.isBlocked ? "Unblock" : "Block"} 
                  className={`${product.isBlocked ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
                >
                  {product.isBlocked ? <FaCheck /> : <FaBan />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsContent;
