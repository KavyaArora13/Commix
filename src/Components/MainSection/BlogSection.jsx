// BlogSection.jsx
import React from 'react';

const BlogSection = () => {
  const blogPosts = [
    { image: 'blog-image1.png', title: 'The Best Celebrity Beauty Brands to Shop in 2024' },
    { image: 'blog-image2.png', title: 'The Best Celebrity Beauty Brands to Shop in 2024' },
    { image: 'blog-image2.png', title: 'The Best Celebrity Beauty Brands to Shop in 2024' },
  ];

  return (
    <section className="blog-section">
      <div className="heading-container">
        <img src={require('../../Assets/Image/bloomLeft.png')} alt="Flower Icon" className="decor-icon left-icon" />
        <h2 className="section-heading">
          <span className="decor-line">BLOG</span>
        </h2>
        <img src={require('../../Assets/Image/bloomRight.png')} alt="Flower Icon" className="decor-icon right-icon" />
      </div>

      <p className="section-description">
        Lorem Ipsum is simply dummy text of the printing and <br/>typesetting industry.
      </p>

      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <div key={index} className="blog-post">
            <img src={require(`../../Assets/Image/${post.image}`)} alt={`Blog ${index + 1}`} className="blog-image" />
            <div className="blog-text">
              <p>It is a long established fact <br/>that</p>
              <h3>{post.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="see-all-button-container">
        <button className="see-all-button">SEE ALL</button>
      </div>
    </section>
  );
};

export default BlogSection;