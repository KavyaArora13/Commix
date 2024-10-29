import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function AddOfferForm({ onClose }) {
  const [offer, setOffer] = useState({
    title: '',
    description: '',
    discount_percentage: 0,
    start_date: '',
    end_date: '',
    product_ids: [],
    image: null
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in offer) {
      if (key === 'product_ids') {
        formData.append(key, JSON.stringify(offer[key]));
      } else {
        formData.append(key, offer[key]);
      }
    }

    try {
      await axios.post(`${API_URL}/offers/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Offer added successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError('Failed to add offer. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  const handleProductSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setOffer({ ...offer, product_ids: selectedOptions });
  };

  const handleFileChange = (e) => {
    setOffer({ ...offer, image: e.target.files[0] });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Offer</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" onChange={handleInputChange} required />
          <textarea name="description" placeholder="Description" onChange={handleInputChange} />
          <input type="number" name="discount_percentage" placeholder="Discount Percentage" onChange={handleInputChange} required />
          <input type="date" name="start_date" onChange={handleInputChange} required />
          <input type="date" name="end_date" onChange={handleInputChange} required />
          <select 
            name="product_ids" 
            multiple 
            onChange={handleProductSelect} 
            required
          >
            <option value="all">All Products</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>{product.name}</option>
            ))}
          </select>
          <input type="file" name="image" onChange={handleFileChange} />
          <button type="submit">Add Offer</button>
        </form>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
