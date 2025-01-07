import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import '../../Assets/Css/Admin/AddProductForm.scss';

const VARIANT_SIZES = ['50ml', '150ml', '250ml'];

const AddProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    ingredients: '',
    hero_ingredients: '',
    functions: '',
    taglines: '',  // Add taglines field
    variants: [{ name: '50ml', price: '', stock_quantity: '' }],
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'category_id') {
      try {
        const response = await axios.get(`${API_URL}/categories/${value}`);
        setSubcategories(response.data.category.subcategories || []);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      }
    }
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      variants: prevState.variants.map((variant, i) => 
        i === index ? { 
          ...variant, 
          [field]: field === 'price' ? parseFloat(value) || 0 : value 
        } : variant
      )
    }));
  };

  const addVariant = () => {
    if (formData.variants.length < VARIANT_SIZES.length) {
      setFormData(prevState => ({
        ...prevState,
        variants: [...prevState.variants, { name: '', price: '', stock_quantity: '' }]
      }));
    }
  };

  const removeVariant = (index) => {
    setFormData(prevState => ({
      ...prevState,
      variants: prevState.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 7) {
      setError('You can only upload a maximum of 7 images.');
      return;
    }
    setImages(files);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate variants
    const validVariants = formData.variants.filter(v => 
      v.name && 
      v.price && 
      v.stock_quantity
    ).map(v => ({
      name: v.name,
      price: Number(v.price),
      stock_quantity: Number(v.stock_quantity)
    }));

    if (validVariants.length === 0) {
      setError('At least one variant with name, price, and stock quantity is required');
      return;
    }

    try {
      const productData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'variants') {
          // Ensure variants are properly stringified
          productData.append('variants', JSON.stringify(validVariants));
        } else if (['ingredients', 'hero_ingredients', 'functions', 'taglines'].includes(key)) {
          const arrayData = formData[key].split(',').map(item => item.trim()).filter(Boolean);
          productData.append(key, JSON.stringify(arrayData));
        } else {
          productData.append(key, formData[key]);
        }
      });
      
      images.forEach((image, index) => {
        productData.append(`files`, image);
      });
  
      const response = await axios.post(`${API_URL}/products/add`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      setSuccess('Product added successfully');
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          description: '',
          category_id: '',
          subcategory_id: '',
          ingredients: '',
          hero_ingredients: '',
          functions: '',
          taglines: '',  // Add taglines field
          variants: [{ name: '50ml', price: '', stock_quantity: '' }],
        });
        setImages([]);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add product. Please try again.');
    }
  };

  return ReactDOM.createPortal(
    <div className="add-product-modal-overlay">
      <div className="add-product-modal-content">
        <div className="add-product-modal__header">
          <h3 className="add-product-modal__title">Add New Product</h3>
          <button onClick={onClose} className="add-product-modal__close-button">
            <svg className="add-product-modal__close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-product-modal__form">
          <div className="add-product-modal__form-group">
            <label htmlFor="name" className="add-product-modal__label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="add-product-modal__input"
            />
          </div>
          
          <div className="add-product-modal__form-group">
            <label htmlFor="description" className="add-product-modal__label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="add-product-modal__textarea"
            ></textarea>
          </div>
          
          <div className="add-product-modal__form-group">
            <label htmlFor="category_id" className="add-product-modal__label">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="add-product-modal__select"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="add-product-modal__form-group">
            <label htmlFor="subcategory_id" className="add-product-modal__label">Subcategory</label>
            <select
              id="subcategory_id"
              name="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleChange}
              required
              className="add-product-modal__select"
              disabled={!formData.category_id}
            >
              <option value="">Select a subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
          </div>
          
          <div className="add-product-modal__form-group">
            <label htmlFor="ingredients" className="add-product-modal__label">Ingredients (comma-separated)</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="add-product-modal__textarea"
            ></textarea>
          </div>
          
          <div className="add-product-modal__form-group">
            <label htmlFor="hero_ingredients" className="add-product-modal__label">
              Hero Ingredients (comma-separated)
            </label>
            <textarea
              id="hero_ingredients"
              name="hero_ingredients"
              value={formData.hero_ingredients}
              onChange={handleChange}
              className="add-product-modal__textarea"
              placeholder="Must be included in the main ingredients list"
            ></textarea>
          </div>

          <div className="add-product-modal__form-group">
            <label htmlFor="functions" className="add-product-modal__label">
              Functions (comma-separated)
            </label>
            <textarea
              id="functions"
              name="functions"
              value={formData.functions}
              onChange={handleChange}
              className="add-product-modal__textarea"
              placeholder="e.g., Moisturizing, Anti-aging, etc."
            ></textarea>
          </div>
          
          <div className="add-product-modal__form-group">
            <label htmlFor="taglines" className="add-product-modal__label">
              Taglines (comma-separated)
            </label>
            <textarea
              id="taglines"
              name="taglines"
              value={formData.taglines}
              onChange={handleChange}
              className="add-product-modal__textarea"
              placeholder="Enter product taglines"
            ></textarea>
          </div>
          
          <div className="add-product-modal__form-group">
            <label className="add-product-modal__label">Variants</label>
            {formData.variants.map((variant, index) => (
              <div key={index} className="variant-row">
                <select
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  className="add-product-modal__select"
                >
                  <option value="">Select size</option>
                  {VARIANT_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  className="add-product-modal__input"
                />
                <input
                  type="number"
                  value={variant.stock_quantity}
                  onChange={(e) => handleVariantChange(index, 'stock_quantity', Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Stock"
                  min="0"
                  className="add-product-modal__input"
                />
                <button type="button" onClick={() => removeVariant(index)} className="remove-variant-btn">
                  Remove
                </button>
              </div>
            ))}
            {formData.variants.length < VARIANT_SIZES.length && (
              <button type="button" onClick={addVariant} className="add-variant-btn">
                Add Variant
              </button>
            )}
          </div>
          
          <div className="add-product-modal__form-group">
            <label htmlFor="images" className="add-product-modal__label">Product Images (Max 7)</label>
            <input
              id="images"
              name="files"
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="add-product-modal__file-input"
            />
          </div>
          
          {error && (
            <div className="add-product-modal__error" role="alert">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="add-product-modal__success" role="alert">
              <span>{success}</span>
            </div>
          )}
          
          <div>
            <button type="submit" className="add-product-modal__submit-button">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddProductForm;
