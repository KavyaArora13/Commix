// In your ProductDetail.jsx or a new component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api'; // Adjust the import based on your project structure

const RecentlyVisitedProducts = ({ userId }) => {
  const [recentlyVisited, setRecentlyVisited] = useState([]);

  useEffect(() => {
    const fetchRecentlyVisited = async () => {
      try {
        const response = await axios.get(`${API_URL}/recentlyVisited/${userId}`);
        setRecentlyVisited(response.data.productVisits);
      } catch (error) {
        console.error('Error fetching recently visited products:', error);
      }
    };

    if (userId) {
      fetchRecentlyVisited();
    }
  }, [userId]);

  return (
    <div className="recently-visited-products">
      <h2>Recently Visited Products</h2>
      <div className="row">
        {recentlyVisited.map((visit) => (
          <div key={visit.productId._id} className="col-md-4">
            <div className="product-card">
              <img src={visit.productId.image_urls[0]} alt={visit.productId.name} />
              <h3>{visit.productId.name}</h3>
              <p>{visit.productId.description}</p>
              <p>Visited at: {new Date(visit.visitedAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyVisitedProducts;