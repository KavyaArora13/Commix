import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import '../Assets/Css/Header.scss';
import SocialIcon from '../Components/SocialIcon.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeaderLogo from '../Assets/Image/comix-logo.gif';
import { checkAuthStatus, logout } from '../features/auth/authActions';
import { fetchUserDetails, setUserDetails } from '../features/user/userSlice.js';
import { API_URL } from "../config/api";
import { updateCartItemCount } from '../features/cart/cartSlice';
import { 
  faHeart, 
  faShoppingCart, 
  faUserCircle,  
  faBars, 
  faTimes,
  faFire,
  faMedal,
  faHome,
  faGift
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const dispatch = useDispatch();
  const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);
  const { user: userDetails, loading: userLoading } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const navigate = useNavigate();

  // Sample data for search dropdown
  const hotPicks = [
    { title: 'Lip Gloss', image: './images/lip1.jpg' },
    { title: 'Foundation', image: './images/lip2.jpg' },
    { title: 'Compact', image: './images/lip3.jpg' },
    { title: 'Palette', image: './images/lip4.jpg' },
    { title: 'Gifting', image: './images/lip5.jpg' }
  ];

  const bestSellers = [
    {
      title: 'Ace Of Face Foundation Stick',
      image: './images/blog1.jpg',
      price: '₹999'
    },
    {
      title: 'Ace Of Face Foundation Stick',
      image: './images/blog2.jpg',
      price: '₹999'
    },
    {
      title: 'Ace Of Face Foundation Stick',
      image: './images/blog3.jpg',
      price: '₹999'
    }
  ];

  const handleSearchMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setIsSearchHovered(true);
  };

  const handleSearchMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsSearchHovered(false);
    }, 300); // Increased delay slightly for better UX
  };

  const handleHeaderSearch = (e) => {
    e.preventDefault();
    if (headerSearchTerm.trim()) {
      const updatedSearches = [
        headerSearchTerm,
        ...recentSearches.filter(term => term !== headerSearchTerm)
      ].slice(0, 5); // Keep only last 5 searches
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
      
      setIsSearchHovered(false);
      setHeaderSearchTerm(''); // Clear search input
      navigate('/product', { state: { searchTerm: headerSearchTerm } });
    }
  };

  const handleSearchTermClick = (term) => {
    setHeaderSearchTerm(''); // Clear search input
    setIsSearchHovered(false); // Hide dropdown
    navigate('/product', { state: { searchTerm: term } });
  };

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
        if (storedUser.id || (storedUser.user && storedUser.user.id)) {
          const userId = storedUser.id || storedUser.user.id;
          await dispatch(fetchUserDetails(userId));
        }
      }
    };
  
    if (isAuthenticated && !userDetails) {
      loadUserDetails();
    }
  }, [dispatch, isAuthenticated, userDetails]);

  useEffect(() => {
    if (userDetails && userDetails.profile_picture) {
      setProfilePicture(userDetails.profile_picture);
    }
  }, [userDetails]);

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
    localStorage.removeItem('user');
    setProfilePicture(null);
    setIsDropdownOpen(false);
    setTimeout(() => {
      navigate('/');
    }, 100);
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
    }, 100);
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
            <span className="user-name">&nbsp;{userName}</span>
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

  const handleFavoritesClick = () => {
    if (isAuthenticated) {
      navigate('/profile', { state: { activeSection: 'favorites' } });
    } else {
      navigate('/login');
    }
  };

  const marqueeItems = [
    "Comix best cosmetic website",
    "Great deals on all products",
    "Free shipping on orders over $50"
  ];

  const totalDuration = 15 * marqueeItems.length; // Total duration for all items

  useEffect(() => {
    const loadRecentSearches = () => {
      const searches = localStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    };
    loadRecentSearches();
  }, []);

  // Add this function to handle clearing recent searches
  const clearRecentSearches = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="marquee-container">
          {marqueeItems.map((item, index) => (
            <div 
              key={index} 
              className="marquee-item"
              style={{
                animationDelay: `${index * 15}s`,
                animationDuration: `${totalDuration}s`
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="header-middle">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={HeaderLogo} alt="COMIX LOGO" className="comix-logo"/>
        </div>

        <div 
          className="search-bar-container"
          onMouseEnter={handleSearchMouseEnter}
          onMouseLeave={handleSearchMouseLeave}
        >
          <form onSubmit={handleHeaderSearch} className="search-form">
            <input 
              className="search-bar" 
              type="text" 
              placeholder="Try Liquid Lipstick"
              value={headerSearchTerm}
              onChange={(e) => setHeaderSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
              <span className="search-text">Search</span>
            </button>
          </form>

          {isSearchHovered && (
            <div className="search-dropdown">
              {recentSearches.length > 0 && (
                <div className="search-section">
                  <div className="section-header">
                    <div className="header-left">
                      <h3>RECENTLY SEARCHED</h3>
                    </div>
                    <button 
                      className="clear-searches" 
                      onClick={clearRecentSearches}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="frequently-searched">
                    {recentSearches.map((term, index) => (
                      <div 
                        key={index} 
                        className="search-term"
                        onClick={() => handleSearchTermClick(term)}
                      >
                        {term}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="search-section">
                <div className="section-header">
                  <SocialIcon icon={faFire} />
                  <h3>HOT PICKS</h3>
                </div>
                <div className="hot-picks">
                  {hotPicks.map((item, index) => (
                    <div key={index} className="hot-pick-item">
                      <img src={item.image} alt={item.title} />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="search-section">
                <div className="section-header">
                  <SocialIcon icon={faMedal} />
                  <h3>BEST SELLERS</h3>
                </div>
                <div className="best-sellers">
                  {bestSellers.map((item, index) => (
                    <div key={index} className="best-seller-item">
                      <img src={item.image} alt={item.title} />
                      <div className="item-details">
                        <span className="title">{item.title}</span>
                        <span className="price">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

       

        <div className="header-icons">
          {renderUserInfo()}
          <span className="icon" onClick={handleFavoritesClick} style={{ cursor: 'pointer' }}>
            <SocialIcon icon={faHeart} />
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
                <span className="sidebar-username">&{getUserName()}</span>
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

      {/* Mobile Footer Navigation */}
      <div className="mobile-footer">
        <Link to="/" className="footer-item">
          <SocialIcon icon={faHome} />
          <span>Home</span>
        </Link>
        <Link to="/cart" className="footer-item">
          <SocialIcon icon={faShoppingCart} />
          <span>Cart</span>
        </Link>
        <Link to="/offers" className="footer-item">
          <SocialIcon icon={faGift} />
          <span>Offers</span>
        </Link>
        <Link to={isAuthenticated ? "/profile" : "/login"} className="footer-item">
          <SocialIcon icon={faUserCircle} />
          <span>Profile</span>
        </Link>
      </div>
    </header>
  );
};

// Add a margin to the main content area to prevent overlap
const MainContent = styled.div`
  margin-top: 60px; // Adjust based on the height of your header
`;

export default Header;
