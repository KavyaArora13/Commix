import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import '../Assets/Css/Header.scss';
import SocialIcon from '../Components/SocialIcon.jsx';
import { faHeart, faShoppingCart, faUserCircle, faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeaderLogo from '../Assets/Image/HeaderLogo.png';
import { checkAuthStatus, logout } from '../features/auth/authActions';
import { fetchUserDetails, setUserDetails } from '../features/user/userSlice.js'
import { API_URL } from "../config/api";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const dropdownTimeout = useRef(null);
  const dispatch = useDispatch();
  const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);
  const { user: userDetails, loading: userLoading } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await dispatch(checkAuthStatus());
      setIsLoading(false);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const loadUserDetails = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        if (storedUser.profile_picture) {
          setProfilePicture(storedUser.profile_picture);
        }
        if (!userDetails) {
          dispatch(setUserDetails(storedUser));
        }
        // Fetch fresh user details only if user ID is available
        if (storedUser.id || (storedUser.user && storedUser.user.id)) {
          const userId = storedUser.id || storedUser.user.id;
          await dispatch(fetchUserDetails(userId)); // Ensure this is awaited
        }
      }
    };
  
    if (isAuthenticated && !userDetails) { // Only fetch if authenticated and userDetails is not set
      loadUserDetails();
    }
  }, [dispatch, isAuthenticated, userDetails]);

  useEffect(() => {
    if (userDetails && userDetails.profile_picture) {
      setProfilePicture(userDetails.profile_picture);
    }
  }, [userDetails]);

  useEffect(() => {
    fetchCartItemCount();
  }, [isAuthenticated]);

  const fetchCartItemCount = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      const user = JSON.parse(userString);
      if (!user.user || !user.user.id) return;
      const response = await axios.get(`${API_URL}/cart/${user.user.id}`);
      const cartItems = response.data.cartItems || [];
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(count);
    } catch (error) {
      console.error("Error fetching cart item count:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    localStorage.removeItem('user');
    setProfilePicture(null);
  };

  const handleMouseEnter = (index) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeaveLips = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const handleMouseLeaveDropdown = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setActiveDropdown(null);
  };

  const navLinks = [
    { 
      name: 'SKINCARE', 
      link: '/skincare',
      dropdown: [
        {
          title: 'LIPSTICKS',
          items: [
            'TRANSFER PROOF LIPSTICKS',
            'MATTE LIPSTICKS',
            'LIQUID LIPSTICKS',
            'CRAYON LIPSTICKS',
            'POWDER LIPSTICKS',
            'SATIN LIPSTICKS',
            'BULLET LIPSTICKS',
            'LIP GLOSS & LINERS'
          ]
        },
        {
          title: 'LIP CARE',
          items: [
            'LIPSTICK FIXERS & REMOVERS',
            'LIP PRIMERS & SCRUBS',
            'LIP BALMS'
          ]
        },
        {
          title: 'LIPSTICK SETS & COMBOS',
          items: [
            'LIPSTICK SETS',
            'LIPSTICK COMBOS'
          ]
        }
      ]
    },
    { name: 'HAIRCARE', link: '/haircare' },
    { name: 'BODYCARE', link: '/bodycare' },
    { name: 'ORALCARE', link: '/oralcare' },
    { name: 'GIFTING', link: '/gifting' },
    { name: 'BESTSELLERS', link: '/bestsellers' },
    { name: 'NEW LAUNCHES', link: '/newlaunches' },
    { name: 'OFFERS', link: '/offers' },
    { name: 'BLOG', link: '/blog' }
  ];

  const getUserName = () => {
    if (!isAuthenticated) {
      return null;
    }
    
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      if (storedUser.username) {
        return storedUser.username;
      }
      if (storedUser.user && storedUser.user.username) {
        return storedUser.user.username;
      }
    }
    
    if (userDetails) {
      return userDetails.username || (userDetails.user && userDetails.user.username);
    }
    
    if (authUser) {
      return authUser.username || (authUser.user && authUser.user.username);
    }
    
    return 'User';
  };

  const renderUserInfo = () => {
    if (isLoading || userLoading) {
      return <div>Loading...</div>;
    }

    if (isAuthenticated) {
      const userName = getUserName();
      return (
        <div className="user-info" ref={dropdownRef}>
          <div onClick={toggleDropdown} className="user-profile-trigger">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-icon" />
            ) : (
              <SocialIcon icon={faUserCircle} />
            )}
            <span className="user-name">{userName}</span>
          </div>
          {isDropdownOpen && (
            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <span className="login-register">
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            <SocialIcon icon={faUserCircle} link="#"/> Login/Register
          </Link>
        </span>
      );
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className='header-top-text'>Commix best cosmetic website</div>
      </div>

      <div className="header-middle">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={HeaderLogo} alt="COMIX LOGO" className="comix-logo"/>
        </div>

        <div className="search-bar-container">
          <input className="search-bar" type="text" placeholder="Try Liquid Lipstick" />
          <button className="search-button">
            <SocialIcon icon={faSearch} link="#"/>
            <span className="search-text">Search</span>
          </button>
        </div>

        <div className="header-icons">
          {renderUserInfo()}
          <span className="icon">
            <SocialIcon icon={faHeart} link="#"/>
          </span>
          <span className="icon" onClick={handleCartClick} style={{ cursor: 'pointer', position: 'relative' }}>
            <SocialIcon icon={faShoppingCart} />
            {cartItemCount > 0 && (
              <span className="cart-item-count">
                {cartItemCount}
              </span>
            )}
          </span>
        </div>

        <button className="nav-toggle" onClick={toggleSidebar}>
          <SocialIcon icon={faBars} />
        </button>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={HeaderLogo} alt="COMIX LOGO" className="sidebar-logo" />
          <div className="sidebar-user-info">
            {isAuthenticated ? (
              <div className="user-info">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="profile-icon" />
                ) : (
                  <SocialIcon icon={faUserCircle} />
                )}
                <span className="sidebar-username">{getUserName()}</span>
              </div>
            ) : null}
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <SocialIcon icon={faTimes} />
          </button>
        </div>
        <nav className="nav">
          {navLinks.map((navItem, index) => (
            <Link key={index} to={navItem.link} className="nav-link" onClick={toggleSidebar}>
              {navItem.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <button className="nav-link" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link" onClick={toggleSidebar}>
              <SocialIcon icon={faUserCircle} /> Login/Register
            </Link>
          )}
        </nav>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <nav className="nav desktop-nav">
        {navLinks.map((navItem, index) => (
          <div 
            key={index} 
            className="nav-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeaveLips}
          >
            <Link to={navItem.link} className="nav-link">
              {navItem.name}
            </Link>
            {navItem.dropdown && activeDropdown === index && (
              <div className="dropdown" onMouseLeave={handleMouseLeaveDropdown}>
                {navItem.dropdown.map((category, catIndex) => (
                  <div key={catIndex} className="dropdown-category">
                    <h3>{category.title}</h3>
                    <ul>
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;