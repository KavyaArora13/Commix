import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import AddBannerForm from './AddBannerForm';
import EditBannerForm from './EditBannerForm';
import '../../Assets/Css/Admin/BannerContent.scss';

export default function BannerContent() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/banners`);
      setBanners(response.data.banners);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to fetch banners. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddBanner = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    fetchBanners();
  };

  const handleEdit = (bannerId) => {
    const bannerToEdit = banners.find(b => b._id === bannerId);
    setEditingBanner(bannerToEdit);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingBanner(null);
  };

  const handleUpdateBanner = (updatedBanner) => {
    setBanners(prevBanners => 
      prevBanners.map(b => b._id === updatedBanner._id ? updatedBanner : b)
    );
    setIsEditFormOpen(false);
    setEditingBanner(null);
  };

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const response = await axios.delete(`${API_URL}/banners/${bannerId}`);
        if (response.data.success) {
          setBanners(prevBanners => prevBanners.filter(b => b._id !== bannerId));
          alert('Banner deleted successfully');
        } else {
          throw new Error(response.data.message || 'Failed to delete banner');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert(error.response?.data?.message || 'Failed to delete banner. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="banner-content">
      <div className="banner-header">
        <h2 className="text-2xl font-bold">Banners</h2>
        <button 
          onClick={handleAddBanner} 
          className="add-banner-btn"
        >
          <FaPlus className="inline-block mr-2" /> Add New Banner
        </button>
      </div>
      <p className="mb-4">Manage your banner catalog here.</p>

      {isAddFormOpen && (
        <AddBannerForm onClose={handleCloseAddForm} />
      )}

      {isEditFormOpen && (
        <EditBannerForm 
          banner={editingBanner} 
          onClose={handleCloseEditForm}
          onUpdate={handleUpdateBanner}
        />
      )}

      {banners.length > 0 ? (
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td className="border px-4 py-2">
                  {banner.image_url ? (
                    <div className="banner-image-container">
                      <img 
                        src={banner.image_url} 
                        alt={banner.title} 
                        className="banner-image"
                      />
                    </div>
                  ) : (
                    <div className="banner-image-container">
                      <FaImage className="banner-image-placeholder" />
                    </div>
                  )}
                </td>
                <td className="border px-4 py-2">{banner.title}</td>
                <td className="border px-4 py-2">{banner.description}</td>
                <td className="border px-4 py-2">{banner.link}</td>
                <td className="border px-4 py-2">{banner.type}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${banner.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => handleEdit(banner._id)} 
                    title="Edit" 
                    className="mr-2 text-green-500 hover:text-green-700"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteBanner(banner._id)} 
                    title="Delete" 
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-banners-message">
          <p>No banners available. Click the "Add New Banner" button to create a banner.</p>
        </div>
      )}
    </div>
  );
}
