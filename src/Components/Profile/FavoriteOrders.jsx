import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Profile/FavoriteOrders.scss';

const FavoriteOrders = () => {
  // Assuming you'll later fetch favorite orders and store them in state
  const favoriteOrders = []; // This should be replaced with actual data later

  return (
    <div className="favorite-orders">
      <h2>Favourite Orders</h2>
      {favoriteOrders.length === 0 ? (
        <div className="no-favorites">
          <FontAwesomeIcon icon={faNoteSticky} className="note-icon" />
          <p>Nothing here yet</p>
        </div>
      ) : (
        // This will be where you map through and display favorite orders
        <div>
          {/* Add favorite orders list here when you have data */}
        </div>
      )}
    </div>
  );
};

export default FavoriteOrders;