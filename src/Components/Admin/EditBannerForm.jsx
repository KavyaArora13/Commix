import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { toast } from 'sonner';

export default function EditBannerForm({ banner, onClose, onUpdate }) {
  const [editedBanner, setEditedBanner] = useState(banner);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      Object.keys(editedBanner).forEach(key => {
        if (key !== '_id' && key !== '__v') {
          formData.append(key, editedBanner[key]);
        }
      });

      const response = await axios.put(`${API_URL}/banners/${editedBanner._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Banner updated successfully');
      onUpdate(response.data.banner);
      onClose();
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Failed to update banner. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Banner</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-image">Banner Image</label>
            <input
              type="file"
              id="edit-image"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input
              type="text"
              id="edit-title"
              value={editedBanner.title}
              onChange={(e) => setEditedBanner({...editedBanner, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={editedBanner.description}
              onChange={(e) => setEditedBanner({...editedBanner, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-link">Link</label>
            <input
              type="text"
              id="edit-link"
              value={editedBanner.link}
              onChange={(e) => setEditedBanner({...editedBanner, link: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-type">Type</label>
            <select
              id="edit-type"
              value={editedBanner.type}
              onChange={(e) => setEditedBanner({...editedBanner, type: e.target.value})}
              required
            >
              <option value="homepage">Homepage Banner</option>
              <option value="productpage">Product Page Banner</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">Update Banner</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
