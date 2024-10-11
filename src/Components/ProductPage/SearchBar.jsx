import React from 'react';
import '../../Assets/Css/ProductPage/SearchBar.scss'; // Import the SCSS file

const SearchBar = ({searchTerm , handleSearch }) => {
    return (
        <div className="search-bar-container mt-4 d-flex justify-content-center">
            <form className=" form-container d-flex w-100">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Find your favorite products" 
                    aria-label="Search"
                    value={searchTerm} 
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-light" onClick={(e) => e.preventDefault()}>
                    <i className="fas fa-search"></i>
                </button>
            </form>
        </div>
    );
}

export default SearchBar;
