import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import './App.css';
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import ProductPage from './Pages/ProductPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Blog from './Pages/Blog.jsx';
import SignUp from './Pages/SignUp.jsx';
import Login from './Pages/Login';
import { Toaster } from 'sonner';
import ProtectedRoute from './Components/GuardRoutes/ProtectedRoute.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import Checkout from './Pages/CheckOut.jsx';
import Cart from './Pages/Cart.jsx';
import SingleBlogPage from './Pages/SingleBlogPage';
import Profile from './Pages/Profile';
import Faq from './Pages/Faq';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './features/auth/authActions';
import { updateCartItemCount } from './features/cart/cartSlice';
import OrderCompleted from './Pages/OrderSucess.jsx';
import Chatbot from './Components/Chatbot/Chatbot.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import NotFound from './Pages/NotFound.jsx';
import Offer from './Pages/Offer.jsx';
import AdminRoute from './Components/GuardRoutes/AdminRoute';
import axios from 'axios';
import { API_URL } from './config/api';
import Career from './Pages/Career.jsx';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
    
    // Set up an interval to fetch the cart count every 30 seconds
    const interval = setInterval(() => {
      fetchCartItemCount();
    }, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  const fetchCartItemCount = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);
      if (!user.user || !user.user.id) return;
      const response = await axios.get(`${API_URL}/cart/${user.user.id}`);
      const cartItems = response.data.cartItems || [];
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      dispatch(updateCartItemCount(count));
    } catch (error) {
      console.error("Error fetching cart item count:", error);
    }
  };

  return (
    <Router>
      <Toaster /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:slug" element={<ProductDetail/>}/>
        <Route path="/singleBlogPage" element={<SingleBlogPage/>} />
        <Route path="/faq" element={<Faq/>}/>
        <Route path="/order-success" element={<OrderCompleted/>}/>
        <Route path="/offer" element={<Offer />} />
        <Route path="/career" element={<Career />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="*" element={<NotFound />} />

        {/* Public routes (redirect to home if already authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminPanel/>}/>
          {/* Add other admin routes here if needed */}
        </Route>
      </Routes>
      <ChatbotWrapper />
    </Router>
  );
}

const ChatbotWrapper = () => {
  const location = useLocation();
  const noChatbotRoutes = ['/login', '/signup', '/order-success', '/admin', '/adminlogin'];

  // Check if the current route is one of the specified routes or if it's a NotFound route
  const showChatbot = !noChatbotRoutes.includes(location.pathname);

  return showChatbot ? <Chatbot /> : null;
};

export default App;