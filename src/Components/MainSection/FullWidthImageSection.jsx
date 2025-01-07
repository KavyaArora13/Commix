import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../../Assets/Css/FullWidthImageSection.scss';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL = 'https://scrollyvideo.js.org/goldengate.mp4';
const CACHE_NAME = 'video-cache-v1';

// Create a singleton for video blob
let cachedVideoBlob = null;

const FullWidthImageSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        if (!cachedVideoBlob) {
          const cache = await caches.open(CACHE_NAME);
          let videoResponse = await cache.match(VIDEO_URL);

          if (!videoResponse) {
            const response = await fetch(VIDEO_URL);
            const blob = await response.blob();
            await cache.put(VIDEO_URL, new Response(blob.slice()));
            videoResponse = await cache.match(VIDEO_URL);
          }

          const blob = await videoResponse.blob();
          cachedVideoBlob = URL.createObjectURL(blob);
        }

        if (videoRef.current) {
          videoRef.current.src = cachedVideoBlob;
        }
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    loadVideo();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const initVideo = () => {
        video.pause();
        video.currentTime = 0;
        ScrollTrigger.refresh(true);
      };

      const setupScrollTrigger = () => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }

        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${video.duration * 150}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          ease: "none",
          immediateRender: true,
          onUpdate: (self) => {
            if (video.duration) {
              const videoTime = Math.min(self.progress * video.duration, video.duration);
              gsap.to(video, {
                duration: 0.1,
                currentTime: videoTime,
                overwrite: true,
                ease: "none"
              });
            }
          },
          onLeave: () => video.currentTime >= video.duration - 0.1
        });
      };

      video.addEventListener('loadeddata', () => {
        setIsLoaded(true);
        initVideo();
        setupScrollTrigger();
      });

      return () => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }
      };
    }
  }, []);

  return (
    <section className={`full-width-image-section ${!isLoaded ? 'loading' : ''}`} ref={containerRef}>
      {!isLoaded && <div className="loading-placeholder">Loading video...</div>}
      <div className="video-wrapper">
        <video
          ref={videoRef}
          muted
          playsInline
          className="full-width-video"
        />
      </div>
    </section>
  );
};

export default FullWidthImageSection;