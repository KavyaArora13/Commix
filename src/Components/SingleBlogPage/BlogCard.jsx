import React from 'react';
import '../../Assets/Css/SingleBlogPage/BlogCard.scss'; // Ensure you have this file

const BlogCard = ({ sectionTitle, imageSrc, content }) => {
  return (
    <div className="blog-card">
      <h2 className="blog-section-title">{sectionTitle}</h2> {/* Title above the image */}
      <img src={imageSrc} alt={sectionTitle} className="blog-card-image" />
      <p className="blog-card-content">{content}</p>
    </div>
  );
};

export default BlogCard;
