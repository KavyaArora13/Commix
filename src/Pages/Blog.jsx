import React from 'react'
import Header from '../Components/Header.jsx'
import BlogBanner from '../Components/Blog/Banner/BlogBanner.jsx'
import SectionHeader from '../Components/Blog/SectionHeader/SectionHeader.jsx'
import CardContainer from '../Components/Blog/CardContainer/CardContainer.jsx'
import blogImage from '../Assets/Image/ycTj7eqYi7-Lipstick-Trends-That-Your-Lips-Will-Love-To-Flaunt (1).jpg'
import Footer from '../Components/Footer.jsx'
import SectionDivider from '../Components/Blog/SectionDivider/SectionDivider.jsx'
import YouTubeVideo from '../Components/Blog/YTvideo/YoutubeVideo.jsx'
import Touch from '../Components/Offer/Touch.jsx'

const Blog = () => {
  const posts = [
    { image: blogImage, title: 'MUST-TRY EYE & LIP COMBINATIONS FOR THIS NEW YEAR' },
    { image: blogImage, title: 'MUST-TRY EYE & LIP COMBINATIONS FOR THIS NEW YEAR' },
    { image: blogImage, title: 'MUST-TRY EYE & LIP COMBINATIONS FOR THIS NEW YEAR' },
    { image: blogImage, title: 'MUST-TRY EYE & LIP COMBINATIONS FOR THIS NEW YEAR' },
  ];

  return (
    <>
      <Header />
      <BlogBanner />
      <SectionHeader title="Popular Posts" />
      <CardContainer posts={posts} />
      <SectionDivider />
      <SectionHeader title="HAIR" />
      <CardContainer posts={posts} />
      <SectionDivider />
      <SectionHeader title="SKIN" />
      <CardContainer posts={posts} />
      <SectionDivider/>
      <SectionHeader title="TRENDING POSTS" />
      <CardContainer posts={posts} />
      <SectionDivider/>
      <SectionHeader title="LATEST POSTS" />
      <YouTubeVideo videoId="dQw4w9WgXcQ" title="Featured YouTube Video" />
      <Touch/>
      <Footer/>
      



    </>
  )
}

export default Blog