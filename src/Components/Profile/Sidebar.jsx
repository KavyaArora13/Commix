import React from 'react';
import '../../Assets/Css/Profile/Sidebar.scss';

const Sidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="sidebar">
      <section className="sidebar-section">
        <h2 className="sidebar-heading">User Details</h2>
        <ul className="sidebar-list">
          <li>
            <a 
              href="#" 
              className={`sidebar-link ${activeSection === 'personal-info' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('personal-info');
              }}
            >
              Personal Information
            </a>
          </li>
        </ul>
      </section>

      <section className="sidebar-section">
        <h2 className="sidebar-heading">Order Details</h2>
        <ul className="sidebar-list">
          <li>
            <a 
              href="#" 
              className={`sidebar-link ${activeSection === 'order-history' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('order-history');
              }}
            >
              Order History
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`sidebar-link ${activeSection === 'my-addresses' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('my-addresses');
              }}
            >
              My addresses
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`sidebar-link ${activeSection === 'favorites' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('favorites');
              }}
            >
              Favorites
            </a>
          </li>
        </ul>
      </section>

      <section className="sidebar-section">
        <h2 className="sidebar-heading">ACCOUNT SETTINGS</h2>
        <ul className="sidebar-list">
          <li>
            <a 
              href="#" 
              className={`sidebar-link ${activeSection === 'delete-account' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('delete-account');
              }}
            >
              Delete Account
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Sidebar;