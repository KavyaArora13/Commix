// src/Components/ProductFilters.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../Assets/Css/ProductFilters.scss';

const ProductFilters = () => {
    return (
        <div className="product-filters">
            <div className="accordion" id="filterAccordion">
                {/* Categories Filter */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Categories
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#filterAccordion">
                        <div className="accordion-body">
                            <ul className="list-group">
                                <li className="list-group-item">Skincare</li>
                                <li className="list-group-item">Makeup</li>
                                <li className="list-group-item">Haircare</li>
                                <li className="list-group-item">Bodycare</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Skin Type Filter */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Skin Type
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#filterAccordion">
                        <div className="accordion-body">
                            <ul className="list-group">
                                <li className="list-group-item">All Skin Types</li>
                                <li className="list-group-item">Oily</li>
                                <li className="list-group-item">Dry</li>
                                <li className="list-group-item">Combination</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Price Range
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#filterAccordion">
                        <div className="accordion-body">
                            <ul className="list-group">
                                <li className="list-group-item">Under $50</li>
                                <li className="list-group-item">$50 - $100</li>
                                <li className="list-group-item">Over $100</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="browse-category">
                <h3>Browse by Popular Category</h3>
                <div className="category-tags">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <Link to="/cleansers" className="tag">Cleansers</Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <Link to="/face-mask" className="tag">Face Mask</Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <Link to="/lipstick" className="tag">Lipstick</Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <Link to="/sunscreens" className="tag">Sunscreens</Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <Link to="/face-moisturizers" className="tag">Face Moisturizers</Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <Link to="/mascara" className="tag">Mascara</Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <Link to="/foundations" className="tag">Foundations</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductFilters;