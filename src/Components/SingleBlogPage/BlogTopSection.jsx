import React from 'react';
import '../../Assets/Css/SingleBlogPage/BlogTopSection.scss'; // Ensure you link the SCSS file

const BlogTopSection = ({ category, author, date }) => {
  return (
    <div className="blog-top-section mt-5">
      <div className="category ps-5">
        <span>CATEGORY:</span> <span className="category-name">{category}</span>
      </div>
      <div className="blog-title">
        Sangeet to Shaadi: Lipstick Shades for Every Indian Bride
      </div>
      <div className="blog-info">
        <span>Written by <span className="author-name">{author}</span></span> | <span>{date}</span>
      </div>
    </div>
  );
};

export default BlogTopSection;
