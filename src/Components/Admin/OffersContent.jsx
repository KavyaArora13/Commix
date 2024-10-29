import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import AddOfferForm from './AddOfferForm';
import EditOfferForm from './EditOfferForm';
import '../../Assets/Css/Admin/OfferContent.scss';

export default function OffersContent() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers`);
      setOffers(response.data.offers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Failed to fetch offers. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddOffer = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    fetchOffers();
  };

  const handleEdit = (offerId) => {
    const offerToEdit = offers.find(o => o._id === offerId);
    setEditingOffer(offerToEdit);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingOffer(null);
  };

  const handleUpdateOffer = (updatedOffer) => {
    setOffers(prevOffers => 
      prevOffers.map(o => o._id === updatedOffer._id ? updatedOffer : o)
    );
    setIsEditFormOpen(false);
    setEditingOffer(null);
  };

  const handleDeleteOffer = async (offerId) => {
    try {
      await axios.delete(`${API_URL}/offers/delete/${offerId}`);
      setOffers(prevOffers => prevOffers.filter(o => o._id !== offerId));
    } catch (error) {
      console.error('Error deleting offer:', error);
      setError('Failed to delete offer. Please try again.');
    }
  };

  if (loading) return <div>Loading offers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="offer-content">
      <div className="offer-header">
        <h2 className="text-2xl font-bold">Offers</h2>
        <button 
          onClick={handleAddOffer} 
          className="add-offer-btn"
        >
          <FaPlus className="inline-block mr-2" /> Add New Offer
        </button>
      </div>
      <p className="mb-4">Manage your offers here.</p>

      {isAddFormOpen && (
        <AddOfferForm onClose={handleCloseAddForm} />
      )}

      {isEditFormOpen && (
        <EditOfferForm 
          offer={editingOffer} 
          onClose={handleCloseEditForm}
          onUpdate={handleUpdateOffer}
        />
      )}

      {offers.length > 0 ? (
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id}>
                <td className="border px-4 py-2">
                  {offer.image_url ? (
                    <div className="offer-image-container">
                      <img 
                        src={offer.image_url} 
                        alt={offer.title} 
                        className="offer-image"
                      />
                    </div>
                  ) : (
                    <div className="offer-image-container">
                      <FaImage className="offer-image-placeholder" />
                    </div>
                  )}
                </td>
                <td className="border px-4 py-2">{offer.title}</td>
                <td className="border px-4 py-2">{offer.discount_percentage}%</td>
                <td className="border px-4 py-2">{new Date(offer.start_date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(offer.end_date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${offer.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => handleEdit(offer._id)} 
                    title="Edit" 
                    className="mr-2 text-green-500 hover:text-green-700"
                    style={{ color: '#28a745' }}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteOffer(offer._id)} 
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
      ) : (
        <div className="no-offers-message">
          <p>No offers available. Click the "Add New Offer" button to create an offer.</p>
        </div>
      )}
    </div>
  );
}
