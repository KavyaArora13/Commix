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
import PrivateRoute from './Components/GuardRoutes/PrivateRoute.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import Checkout from './Pages/CheckOut.jsx';
import Cart from './Pages/Cart.jsx';
import SingleBlogPage from './Pages/SingleBlogPage';
import Profile from './Pages/Profile';
import Faq from './Pages/Faq';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './features/auth/authActions';
import OrderCompleted from './Pages/OrderSucess.jsx';
import Chatbot from './Components/Chatbot/Chatbot.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

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
        <Route path='/admin' element={<AdminPanel/>}/>

        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/adminlogin" element={<AdminLogin/>}/>

        {/* Public routes (redirect to home if already authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
      <ChatbotWrapper />
    </Router>
  );
}

const ChatbotWrapper = () => {
  const location = useLocation();
  const noChatbotRoutes = ['/login', '/signup', '/order-success','/admin','/adminlogin'];

  // Check if the current route is one of the specified routes
  const showChatbot = !noChatbotRoutes.includes(location.pathname);

  return showChatbot ? <Chatbot /> : null;
};

export default App;