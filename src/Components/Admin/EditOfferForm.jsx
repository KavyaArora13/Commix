import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function EditOfferForm({ offer, onClose, onUpdate }) {
  const [editedOffer, setEditedOffer] = useState({
    ...offer,
    start_date: offer.start_date.split('T')[0],
    end_date: offer.end_date.split('T')[0],
    image: null
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(offer.image_url || null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setEditedOffer(prev => ({
      ...prev,
      product_ids: offer.product_ids.length === 0 ? ['all'] : offer.product_ids
    }));
  }, [offer.product_ids]);

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
    for (const key in editedOffer) {
      if (key === 'product_ids') {
        formData.append(key, JSON.stringify(editedOffer[key]));
      } else if (key !== 'image' || (key === 'image' && editedOffer.image)) {
        formData.append(key, editedOffer[key]);
      }
    }

    try {
      const response = await axios.put(`${API_URL}/offers/edit/${offer._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Offer updated successfully!');
      onUpdate(response.data.offer);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError('Failed to update offer. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOffer({ ...editedOffer, [name]: value });
  };

  const handleProductSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    if (selectedOptions.includes('all')) {
      setEditedOffer({ ...editedOffer, product_ids: ['all'] });
    } else {
      setEditedOffer({ ...editedOffer, product_ids: selectedOptions });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditedOffer({ ...editedOffer, image: file });
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Offer</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={editedOffer.title} onChange={handleInputChange} required />
          <textarea name="description" value={editedOffer.description} onChange={handleInputChange} />
          <input type="number" name="discount_percentage" value={editedOffer.discount_percentage} onChange={handleInputChange} required />
          <input type="date" name="start_date" value={editedOffer.start_date} onChange={handleInputChange} required />
          <input type="date" name="end_date" value={editedOffer.end_date} onChange={handleInputChange} required />
          <select 
            name="product_ids" 
            multiple 
            value={editedOffer.product_ids}
            onChange={handleProductSelect} 
            required
          >
            <option value="all">All Products</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>{product.name}</option>
            ))}
          </select>
          <div>
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={editedOffer.is_active}
                onChange={(e) => setEditedOffer({ ...editedOffer, is_active: e.target.checked })}
              />
              Active
            </label>
          </div>
          <div>
            <label>Image:</label>
            {imagePreview && (
              <div>
                <img src={imagePreview} alt="Offer preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              </div>
            )}
            <input type="file" name="image" onChange={handleFileChange} />
          </div>
          <button type="submit">Update Offer</button>
        </form>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
