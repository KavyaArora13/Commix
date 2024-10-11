import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaEdit, FaBan, FaEye, FaPlus, FaArrowLeft, FaCheck } from 'react-icons/fa';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import '../../Assets/Css/Admin/ProductContent.scss';

export default function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
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

  const handleEdit = (productId) => {
    const productToEdit = products.find(p => p._id === productId);
    setEditingProduct(productToEdit);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingProduct(null);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
    setIsEditFormOpen(false);
    setEditingProduct(null);
  };

  const handleBlock = async (productId) => {
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
          <p><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
          <p><strong>Stock Quantity:</strong> {selectedProduct.stock_quantity}</p>
          <p><strong>Category:</strong> {selectedProduct.category_id && selectedProduct.category_id.name ? selectedProduct.category_id.name : 'N/A'}</p>
          <p><strong>Brand:</strong> {selectedProduct.brand}</p>
          <p><strong>Rating:</strong> {selectedProduct.rating}</p>
          <p><strong>Discount Percentage:</strong> {selectedProduct.discount_percentage}%</p>
          <p><strong>Description:</strong> {selectedProduct.description}</p>
          <p><strong>Status:</strong> {selectedProduct.isBlocked ? 'Inactive' : 'Active'}</p>
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

      {isEditFormOpen && (
        <EditProductForm 
          product={editingProduct} 
          onClose={handleCloseEditForm}
          onUpdate={handleUpdateProduct}
        />
      )}

      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Brand</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">${product.price.toFixed(2)}</td>
              <td className="border px-4 py-2">{product.stock_quantity}</td>
              <td className="border px-4 py-2">
                {product.category_id && product.category_id.name ? product.category_id.name : 'N/A'}
              </td>
              <td className="border px-4 py-2">{product.brand}</td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 rounded ${product.isBlocked ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {product.isBlocked ? 'Inactive' : 'Active'}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => handleView(product._id)} title="View" className="mr-2 text-blue-500 hover:text-blue-700">
                  <FaEye />
                </button>
                <button onClick={() => handleEdit(product._id)} title="Edit" className="mr-2 text-green-500 hover:text-green-700">
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleBlock(product._id)} 
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
}