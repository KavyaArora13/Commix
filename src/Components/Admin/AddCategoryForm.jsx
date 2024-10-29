import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { toast } from 'sonner';

export default function AddCategoryForm({ onClose }) {
  const [newCategory, setNewCategory] = useState({ name: '', description: '', subcategories: [] });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/categories/add`, newCategory);
      toast.success('Category added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding new category:', error);
      toast.error('Failed to add new category. Please try again.');
    }
  };

  const addSubcategory = () => {
    if (newSubcategory.name) {
      setNewCategory({
        ...newCategory,
        subcategories: [...newCategory.subcategories, newSubcategory]
      });
      setNewSubcategory({ name: '', description: '' });
    }
  };

  const removeSubcategory = (index) => {
    const updatedSubcategories = newCategory.subcategories.filter((_, i) => i !== index);
    setNewCategory({ ...newCategory, subcategories: updatedSubcategories });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Category</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
            />
          </div>
          <div className="form-group">
            <h4>Subcategories</h4>
            {newCategory.subcategories.map((sub, index) => (
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
            <button type="submit" className="submit-btn">Add Category</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
