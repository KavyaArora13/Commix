import React, { useState, useEffect } from 'react';
import './Banner.scss';
import image1 from '../../../Assets/Image/smCZivih6Bronze Your Face For A Goddess Like Glow.jpg'
import image2 from '../../../Assets/Image/ycTj7eqYi7-Lipstick-Trends-That-Your-Lips-Will-Love-To-Flaunt (1).jpg'

const images = [
    {
        src: image1,
        alt: 'Image 1',
        caption: "It's A Lash Evolution With Maximeyes Drama Magnetic Lashes & Eyeliner"
    },
    {
        src: image2,
        alt: 'Image 2',
        caption: "Caption for Image 2"
    }
];

const BlogBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Add automatic sliding
    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, []);

    return (
        <div className="image-slider">
            <div className="slider-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((image, index) => (
                    <div key={index} className="slide">
                        <img src={image.src} alt={image.alt} />
                        <div className="caption">
                            <h2>{image.caption}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={prevSlide} className="nav-button prev">&lt;</button>
            <button onClick={nextSlide} className="nav-button next">&gt;</button>
        </div>
    );
};

export default BlogBanner;