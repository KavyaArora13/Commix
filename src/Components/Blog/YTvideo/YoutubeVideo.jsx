// src/Components/Blog/YTvideo/YoutubeVideo.jsx

import React from 'react';
import './YouTubeVideo.scss';

const YouTubeVideo = ({ videoId, title }) => {
  return (
    <div className="youtube-video-wrapper">
      <div className="youtube-video-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubeVideo;