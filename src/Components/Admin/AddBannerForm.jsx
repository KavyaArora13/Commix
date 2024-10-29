import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { toast } from 'sonner';

export default function AddBannerForm({ onClose }) {
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    link: '',
    type: 'homepage',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      Object.keys(newBanner).forEach(key => {
        formData.append(key, newBanner[key]);
      });

      await axios.post(`${API_URL}/banners/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Banner added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding new banner:', error);
      toast.error('Failed to add new banner. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Banner</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Banner Image</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept="image/*"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={newBanner.title}
              onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newBanner.description}
              onChange={(e) => setNewBanner({...newBanner, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input
              type="text"
              id="link"
              value={newBanner.link}
              onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={newBanner.type}
              onChange={(e) => setNewBanner({...newBanner, type: e.target.value})}
              required
            >
              <option value="homepage">Homepage Banner</option>
              <option value="productpage">Product Page Banner</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">Add Banner</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
