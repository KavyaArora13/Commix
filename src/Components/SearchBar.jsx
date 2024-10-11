import React from 'react';
import '../Assets/Css/SearchBar.scss'; // Import the SCSS file

const SearchBar = () => {
    return (
        <div className="search-bar-container mt-4 d-flex justify-content-center">
            <form className=" form-container d-flex w-100">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Find your favorite products" 
                    aria-label="Search" 
                />
                <button type="submit" className="btn btn-light">
                    <i className="fas fa-search"></i>
                </button>
            </form>
        </div>
    );
}

export default SearchBar;
