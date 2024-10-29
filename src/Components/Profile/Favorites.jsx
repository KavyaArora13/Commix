import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react'; // Import the Trash2 icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import '../../Assets/Css/Profile/FavoriteOrders.scss';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        try {
          const response = await axios.get(`${API_URL}/favorites`, {
            params: { user_id: user.user.id }
          });
          setFavorites(response.data.favorites);

          const productIds = response.data.favorites.map(fav => fav.product_id._id);
          const productsResponse = await axios.post(`${API_URL}/favorites/batch`, { product_ids: productIds });
          setProducts(productsResponse.data.products || []);
        } catch (error) {
          console.error('Error fetching favorite products:', error);
        }
      }
    };

    fetchFavorites();
  }, []);

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`); // Use slug for navigation
  };

  const handleUnfavorite = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      try {
        await axios.delete(`${API_URL}/favorites/delete`, {
          data: {
            user_id: user.user.id,
            product_id: productId
          }
        });
        setFavorites(favorites.filter(favorite => favorite.product_id._id !== productId));
        setProducts(products.filter(product => product._id !== productId));
      } catch (error) {
        console.error('Error unfavoriting product:', error);
      }
    }
  };

  return (
    <div className="favorite-orders">
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <Heart className="note-icon" />
          <p>Nothing here yet</p>
        </div>
      ) : (
        <div className="favorites-list">
          {products.map(product => {
            const favorite = favorites.find(fav => fav.product_id._id === product._id);
            if (favorite) {
              return (
                <div key={favorite._id} className="favorite-item">
                  <div onClick={() => handleProductClick(product.slug)} className="favorite-product"> {/* Use slug here */}
                    <img src={product.image_urls[0]} alt={product.name} className="product-image" />
                    <h3 className="product-name">{product.name}</h3>
                    <p>Price: Rs. {product.price}</p>
                  </div>
                  <button onClick={() => handleUnfavorite(product._id)} className="unfavorite-btn">
                    <Trash2 className="icon" />
                    Unfavorite
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;