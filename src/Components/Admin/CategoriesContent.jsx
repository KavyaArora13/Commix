import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AddCategoryForm from './AddCategoryForm';
import EditCategoryForm from './EditCategoryForm';
import '../../Assets/Css/Admin/CategoryContent.scss';

export default function CategoriesContent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    fetchCategories();
  };

  const handleEdit = (categoryId) => {
    const categoryToEdit = categories.find(c => c._id === categoryId);
    setEditingCategory(categoryToEdit);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingCategory(null);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories(prevCategories => 
      prevCategories.map(c => c._id === updatedCategory._id ? updatedCategory : c)
    );
    setIsEditFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      setCategories(prevCategories => prevCategories.filter(c => c._id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. Please try again.');
    }
  };

  const CategoriesTable = ({ categories, onEdit, onDelete }) => {
    return (
      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Subcategories</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="border px-4 py-2">{category.name}</td>
              <td className="border px-4 py-2">{category.description}</td>
              <td className="border px-4 py-2">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <ul className="list-disc pl-4">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory._id || subcategory.name}>{subcategory.name}</li>
                    ))}
                  </ul>
                ) : (
                  "No subcategories"
                )}
              </td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => onEdit(category._id)} 
                  title="Edit" 
                  className="mr-2 text-green-500 hover:text-green-700"
                  style={{ color: '#28a745' }}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => onDelete(category._id)} 
                  title="Delete" 
                  className="text-red-500 hover:text-red-700"
                  style={{ color: '#dc3545' }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="category-content">
      <div className="category-header">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button 
          onClick={handleAddCategory} 
          className="add-category-btn"
        >
          <FaPlus className="inline-block mr-2" /> Add New Category
        </button>
      </div>
      <p className="mb-4">Manage your product categories here.</p>

      {isAddFormOpen && (
        <AddCategoryForm onClose={handleCloseAddForm} />
      )}

      {isEditFormOpen && (
        <EditCategoryForm 
          category={editingCategory} 
          onClose={handleCloseEditForm}
          onUpdate={handleUpdateCategory}
        />
      )}

      {categories.length > 0 ? (
        <CategoriesTable 
          categories={categories} 
          onEdit={handleEdit} 
          onDelete={handleDeleteCategory} 
        />
      ) : (
        <div className="no-categories-message">
          <p>No categories available. Click the "Add New Category" button to create a category.</p>
        </div>
      )}
    </div>
  );
}
