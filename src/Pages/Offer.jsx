import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Touch from '../Components/Touch';
import CouponCard from '../Components/Offer/CouponCard';
import '../Assets/Css/Offer/Offer.scss';
import axios from 'axios'; // Make sure axios is installed
import { API_URL } from '../config/api';

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_URL}/offers/active-offers`); // Adjust the URL as needed
        setOffers(response.data.offers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Failed to load offers. Please try again later.');
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) return <div>Loading offers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />

      <div className="container mt-4">
        {offers.length > 0 ? (
          <div className="row">
            {offers.map((offer) => (
              <CouponCard
                key={offer._id}
                imageSrc={offer.image_url}
                couponCode={offer.title}
                description={offer.description}
                discountPercentage={offer.discount_percentage}
                startDate={new Date(offer.start_date).toLocaleDateString()}
                endDate={new Date(offer.end_date).toLocaleDateString()}
              />
            ))}
          </div>
        ) : (
          <div className="no-offers-message">
            <h2>No offers available at the moment</h2>
            <p>Please check back later for new offers and discounts!</p>
          </div>
        )}
      </div>

      <Touch />
      <Footer />
    </>
  );
};

export default Offer;
