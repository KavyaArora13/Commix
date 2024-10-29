import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import '../../Assets/Css/ProductPage/Banner.scss';

const Banner = () => {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        fetchBanner();
    }, []);

    const fetchBanner = async () => {
        try {
            const response = await axios.get(`${API_URL}/banners`);
            const productPageBanner = response.data.banners.find(banner => banner.type === 'productpage');
            setBanner(productPageBanner);
        } catch (error) {
            console.error('Error fetching banner:', error);
        }
    };

    if (!banner) return null;

    return (
        <div className="hero-banner mt-3 row" style={{backgroundImage: `url(${banner.image_url})`}}>
            <div className="col-12 col-md-10 col-lg-12 text-center">
                <h1 className="main-heading">{banner.title}</h1>
                <p className="sub-heading mt-3">{banner.description}</p>
            </div>
        </div>
    );
};

export default Banner;
