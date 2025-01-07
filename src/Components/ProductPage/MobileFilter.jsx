import React, { useState } from 'react';
import '../../Assets/Css/ProductPage/MobileFilter.scss';
import { MdFilterList } from "react-icons/md";

const MobileFilter = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mobile-filter">
        <div onClick={toggleDropdown} className="filter-toggle" role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && toggleDropdown()}>
            <MdFilterList className="filter-icon" />
            <span className="filter-text">Filter</span>
            <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isOpen && (
            <div className="dropdown-content">
                <div className="dropdown-item">
                    <select 
                      id="sortOptions" 
                      value={sortOption} 
                      onChange={(e) => setSortOption(e.target.value)} 
                      className="sort-select"
                    >
                        <option value="" disabled>Sort By</option>
                        <option value="AtoZ">A to Z</option>
                        <option value="ZtoA">Z to A</option>
                        <option value="priceLowToHigh">Price Low to High</option>
                        <option value="priceHighToLow">Price High to Low</option>
                    </select>
                </div>
                <div className="dropdown-item">Option 1</div>
                <div className="dropdown-item">Option 2</div>
                <div className="dropdown-item">Option 3</div>
            </div>
        )}
    </div>
  );
}

export default MobileFilter;