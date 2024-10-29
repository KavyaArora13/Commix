import React, { useState, useEffect } from 'react';
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.cjs.jsx';
import '../../Assets/Css/FullWidthImageSection.scss';

const VIDEO_URL = 'https://scrollyvideo.js.org/goldengate.mp4';
const CACHE_NAME = 'video-cache-v1';

const FullWidthImageSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);

  useEffect(() => {
    const cacheVideo = async () => {
      // Check if the video is already in the cache
      const cache = await caches.open(CACHE_NAME);
      let cachedResponse = await cache.match(VIDEO_URL);

      if (!cachedResponse) {
        // If not in cache, fetch and cache it
        const response = await fetch(VIDEO_URL);
        const blob = await response.blob();
        await cache.put(VIDEO_URL, new Response(blob));
        cachedResponse = await cache.match(VIDEO_URL);
      }

      // Get the blob from the cached response
      const blob = await cachedResponse.blob();
      setVideoBlob(URL.createObjectURL(blob));
      setIsLoaded(true);
    };

    cacheVideo();

    // Cleanup function
    return () => {
      if (videoBlob) {
        URL.revokeObjectURL(videoBlob);
      }
    };
  }, []);

  return (
    <section className="full-width-image-section">
      {!isLoaded && <div className="loading-placeholder">Loading video...</div>}
      {videoBlob && (
        <ScrollyVideo 
          src={videoBlob}
          transitionSpeed={8}
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
      )}
    </section>
  );
};

export default FullWidthImageSection;