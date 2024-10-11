// src/Components/Admin/EditProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaTimes } from 'react-icons/fa';

const EditProductForm = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    brand: '',
    rating: '',
    discount_percentage: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        category_id: product.category_id?._id || product.category_id || '',
        brand: product.brand || '',
        rating: product.rating || '',
        discount_percentage: product.discount_percentage || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      setError('You can only upload a maximum of 4 images.');
      return;
    }
    setImages(files);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if any changes were made
    const hasChanges = Object.keys(formData).some(key => formData[key] !== product[key]);
    if (!hasChanges && images.length === 0) {
      setError('No changes were made to the product.');
      return;
    }

    try {
      const productData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'category_id' && formData[key]) {
          productData.append(key, formData[key]);
        } else if (formData[key] !== '') {
          productData.append(key, formData[key]);
        }
      });
      
      if (images.length > 0) {
        images.forEach((image, index) => {
          productData.append(`files`, image);
        });
      } else {
        // If no new images are selected, send a flag to the server
        productData.append('noNewImages', 'true');
      }

      console.log('Product data being sent:', Object.fromEntries(productData));

      const response = await axios.put(`${API_URL}/products/edit/${product._id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Product updated successfully');
      setTimeout(() => {
        onUpdate(response.data.product);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      setError(`Failed to update product. ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category ID</label>
            <input
              id="category_id"
              name="category_id"
              type="text"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              id="brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
              <input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700">Discount Percentage</label>
              <input
                id="discount_percentage"
                name="discount_percentage"
                type="number"
                value={formData.discount_percentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Product Images (Max 4)</label>
            <input
              id="images"
              name="files"
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          <div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;