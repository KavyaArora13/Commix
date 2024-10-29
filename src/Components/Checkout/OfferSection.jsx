import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Assets/Css/CheckOut/VoucherSection.scss';
import { API_URL } from "../../config/api.js";

const OfferSection = ({ onApplyOffer, appliedOffer }) => {
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (appliedOffer) {
      setSelectedOfferId(appliedOffer._id);
    } else {
      setSelectedOfferId('');
    }
  }, [appliedOffer]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers/active-offers`);
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Failed to load offers');
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onApplyOffer(selectedOfferId);
    } catch (err) {
      setError(err.message || 'Failed to apply offer');
    }
  };

  return (
    <div className="offer-section">
      <h3>Available Offers</h3>
      {offers.length > 0 ? (
        <form onSubmit={handleOfferSubmit}>
          <select
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
          >
            <option value="">Select an offer</option>
            {offers.map((offer) => (
              <option key={offer._id} value={offer._id}>
                {offer.title} - {offer.discount_percentage}% off
              </option>
            ))}
          </select>
          <button type="submit">
            {appliedOffer ? 'Change Offer' : 'Apply Offer'}
          </button>
        </form>
      ) : (
        <p>No offers available at the moment.</p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default OfferSection;
