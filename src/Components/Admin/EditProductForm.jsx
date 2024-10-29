// src/Components/Admin/EditProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { X } from 'lucide-react';
import '../../Assets/Css/Admin/EditProductForm.scss';

const VARIANT_SIZES = ['50ml', '150ml', '250ml'];

const EditProductForm = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category?._id || product?.category_id?._id || '',
    subcategory_id: product?.subcategory?._id || product?.subcategory_id?._id || '',
    ingredients: Array.isArray(product?.ingredients) 
      ? product.ingredients.join(', ') 
      : product?.ingredients || '',
    hero_ingredients: Array.isArray(product?.hero_ingredients) 
      ? product.hero_ingredients.join(', ') 
      : product?.hero_ingredients || '',
    functions: Array.isArray(product?.functions) 
      ? product.functions.join(', ') 
      : product?.functions || '',
    taglines: Array.isArray(product?.taglines) 
      ? product.taglines.join(', ') 
      : product?.taglines || '',
    variants: product?.variants?.map(variant => ({
      name: variant.name || '',
      price: variant.price || '',
      stock_quantity: variant.stock_quantity || ''
    })) || []
  });
  const [existingImages, setExistingImages] = useState(product?.image_urls || []);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (formData.category_id) {
      const selectedCategory = categories.find(cat => cat._id === formData.category_id);
      setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
    }
  }, [formData.category_id, categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'category_id') {
      const selectedCategory = categories.find(cat => cat._id === value);
      setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
      setFormData(prevState => ({ ...prevState, subcategory_id: '' }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setFormData(prevState => ({
      ...prevState,
      variants: updatedVariants
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
    if (!formData.variants || formData.variants.length === 0) {
      setError('At least one variant is required');
      return;
    }

    // Validate that each variant has required fields
    const invalidVariants = formData.variants.some(
      variant => !variant.name || !variant.price || !variant.stock_quantity
    );
    if (invalidVariants) {
      setError('All variant fields (name, price, and stock) are required');
      return;
    }

    try {
      const productData = new FormData();
      
      // Convert variants to proper format
      const validVariants = formData.variants.map(variant => ({
        name: variant.name,
        price: Number(variant.price),
        stock_quantity: Number(variant.stock_quantity)
      }));

      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'variants') {
          productData.append(key, JSON.stringify(validVariants));
        } else if (['ingredients', 'hero_ingredients', 'functions', 'taglines'].includes(key)) {
          const arrayData = formData[key].split(',').map(item => item.trim()).filter(Boolean);
          productData.append(key, JSON.stringify(arrayData));
        } else {
          productData.append(key, formData[key]);
        }
      });

      if (images.length > 0) {
        images.forEach((image, index) => {
          productData.append(`files`, image);
        });
      } else {
        productData.append('noNewImages', 'true');
      }

      console.log('Product data being sent:', Object.fromEntries(productData));

      const response = await axios.put(`${API_URL}/products/edit/${product._id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Server response:', response.data);

      setSuccess('Product updated successfully');
      setTimeout(() => {
        onUpdate(response.data.product);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to update product');
    }
  };

  const renderImagePreviews = () => (
    <div className="image-previews">
      <h4>Current Images:</h4>
      <div className="existing-images-grid">
        {existingImages.map((url, index) => (
          <div key={index} className="image-preview-container">
            <img src={url} alt={`Product ${index + 1}`} className="image-preview" />
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <>
          <h4>New Images to Upload:</h4>
          <div className="new-images-grid">
            {Array.from(images).map((file, index) => (
              <div key={index} className="image-preview-container">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`New upload ${index + 1}`} 
                  className="image-preview" 
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderVariants = () => (
    <div className="variants-section">
      <label>Variants</label>
      {formData.variants.map((variant, index) => (
        <div key={index} className="variant-row">
          <select
            value={variant.name}
            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
            required
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
            required
            min="0"
          />
          <input
            type="number"
            value={variant.stock_quantity}
            onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
            placeholder="Stock"
            required
            min="0"
          />
          <button 
            type="button" 
            onClick={() => removeVariant(index)}
            disabled={formData.variants.length === 1}
          >Remove</button>
        </div>
      ))}
      {formData.variants.length < VARIANT_SIZES.length && (
        <button type="button" onClick={addVariant}>Add Variant</button>
      )}
    </div>
  );

  return (
    <div className="edit-product-modal-overlay">
      <div className="edit-product-modal-content">
        <button onClick={onClose} className="close-button" aria-label="Close">
          <X size={24} />
        </button>
        <h3 className="modal-title">Edit Product</h3>
        <form onSubmit={handleSubmit} className="edit-product-form">
          <div>
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div>
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory_id">Subcategory</label>
            <select
              id="subcategory_id"
              name="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ingredients">Ingredients (comma-separated)</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div>
            <label htmlFor="hero_ingredients">Hero Ingredients (comma-separated)</label>
            <textarea
              id="hero_ingredients"
              name="hero_ingredients"
              value={formData.hero_ingredients}
              onChange={handleChange}
              rows="3"
              placeholder="Must be included in the main ingredients list"
            ></textarea>
          </div>
          <div>
            <label htmlFor="functions">Functions (comma-separated)</label>
            <textarea
              id="functions"
              name="functions"
              value={formData.functions}
              onChange={handleChange}
              rows="3"
              placeholder="e.g., Moisturizing, Anti-aging"
            ></textarea>
          </div>
          <div>
            <label htmlFor="taglines">Taglines (comma-separated)</label>
            <textarea
              id="taglines"
              name="taglines"
              value={formData.taglines}
              onChange={handleChange}
              rows="3"
              placeholder="Enter product taglines"
            ></textarea>
          </div>
          {renderVariants()}
          {renderImagePreviews()}
          <div>
            <label htmlFor="images">Add New Images (Max 7 total)</label>
            <input
              id="images"
              name="files"
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="file-input"
            />
            <small>Current images: {existingImages.length}, New images: {images.length}</small>
          </div>
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="success-message">
              <span>{success}</span>
            </div>
          )}
          <div>
            <button type="submit">Update Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
