import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CartProduct from '../Components/Cart/CartProduct';
import OrderSummary from '../Components/Cart/OrderSummary';
import RecommendedProduct from '../Components/Cart/RecommendedProduct';
import CardComponent from '../Components/ProductPage/CardComponent';
import { API_URL } from "../config/api";
import '../Assets/Css/Cart/Cart.scss';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchCartData();
      fetchAllProducts();
    };
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartProducts]);

  const fetchCartData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        navigate('/login');
        return;
      }
      const response = await axios.get(`${API_URL}/cart/${user.id}`);
      setCartProducts(response.data.cartItems);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    const total = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    setSubtotal(total);
    setItemCount(count);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        navigate('/login');
        return;
      }
      await axios.post(`${API_URL}/cart/add`, {
        user_id: user.id,
        product_id: productId,
        quantity: newQuantity - cartProducts.find(p => p.product_id._id === productId).quantity
      });
      fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDelete = async (productId, variantName, quantity) => {
    try {
      if (!productId) {
        console.error('Product ID is missing');
        return;
      }

      const userId = JSON.parse(localStorage.getItem('user'))?.user?.id;
      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          variant_name: variantName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCartProducts(prevItems => 
        prevItems.filter(item => 
          !(item.product_id._id === productId && item.variant_name === variantName)
        )
      );

    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/`);
      const allProducts = response.data.products;

      console.log("All products:", allProducts);
      
      if (Array.isArray(allProducts)) {
        // Filter out products that are already in the cart
        const cartProductIds = new Set(cartProducts.map(item => item.product_id._id));
        const availableProducts = allProducts.filter(product => !cartProductIds.has(product._id));
        
        console.log("Available products for recommendations:", availableProducts);
        
        // Shuffle the available products
        const shuffled = availableProducts.sort(() => 0.5 - Math.random());
        
        // Set recommended products (up to 5)
        setRecommendedProducts(shuffled.slice(0, 5));
        
        // Set best sellers (next 4 products)
        setBestSellers(shuffled.slice(5, 9));
      } else {
        console.error("Unexpected response format for products:", allProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container-fluid mt-3">
        <div className="cart-header">
          <h1>Cart</h1>
          <Link to="/" className="continue-shopping">
            <span>←</span>
            continue shopping
          </Link>
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9 mb-4">
            {cartProducts.map(product => (
              <CartProduct 
                key={product._id}
                product={product}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
            <OrderSummary subtotal={subtotal} itemCount={itemCount} />
            <div className="recommended-products">
              <h5 className="mb-3">Recommended Products</h5>
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map(product => (
                  <RecommendedProduct key={product._id} product={product} />
                ))
              ) : (
                <p>No recommended products available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5 p-4">
        <div className="col-lg-10 col-md-9 col-sm-12">
          <p className="section-subtitle1">Top Seller</p>
          <h2 className="section-title1">Explore Our Best Collections</h2>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-12 d-flex justify-content-end align-items-center">
          <button className="btn btn-dark view-all-button1">VIEW ALL</button>
        </div>
      </div>
      <div className='row mt-4 p-4'>
        {bestSellers.map((product) => (
          <CardComponent
            key={product._id}
            image={product.image}
            title={product.name}
            price={product.price}
            description={product.description}
          />
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
