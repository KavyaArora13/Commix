import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { toast } from 'sonner';

export default function EditCategoryForm({ category, onClose, onUpdate }) {
  const [editedCategory, setEditedCategory] = useState(category);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/categories/${editedCategory._id}`, editedCategory);
      toast.success('Category updated successfully');
      onUpdate(response.data.category);
      onClose();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category. Please try again.');
    }
  };

  const addSubcategory = () => {
    if (newSubcategory.name) {
      setEditedCategory({
        ...editedCategory,
        subcategories: [...editedCategory.subcategories, newSubcategory]
      });
      setNewSubcategory({ name: '', description: '' });
    }
  };

  const removeSubcategory = (index) => {
    const updatedSubcategories = editedCategory.subcategories.filter((_, i) => i !== index);
    setEditedCategory({ ...editedCategory, subcategories: updatedSubcategories });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Category</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-name">Category Name</label>
            <input
              type="text"
              id="edit-name"
              value={editedCategory.name}
              onChange={(e) => setEditedCategory({...editedCategory, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={editedCategory.description}
              onChange={(e) => setEditedCategory({...editedCategory, description: e.target.value})}
            />
          </div>
          <div className="form-group">
            <h4>Subcategories</h4>
            {editedCategory.subcategories.map((sub, index) => (
              <div key={index} className="subcategory-item">
                <span>{sub.name}</span>
                <button type="button" onClick={() => removeSubcategory(index)}>Remove</button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Subcategory Name"
              value={newSubcategory.name}
              onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Subcategory Description"
              value={newSubcategory.description}
              onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
            />
            <button type="button" onClick={addSubcategory}>Add Subcategory</button>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">Update Category</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
