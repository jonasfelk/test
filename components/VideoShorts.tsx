'use client'
import React, { useState, useRef, useEffect } from "react";
export const runtime = 'edge'
// Пример списка видео
const initialVideos = [
  {
    id: 1,
    src: "https://res.cloudinary.com/videoapi-demo/video/upload/f_auto,q_auto/v1/fai1n9brqkg3vxpdd8ef.mp4",
  },
  { id: 2, src: "https://www.w3schools.com/html/movie.mp4" },
  { id: 3, src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  {
    id: 4,
    src: "https://res.cloudinary.com/videoapi-demo/video/upload/f_auto,q_auto/v1/fai1n9brqkg3vxpdd8ef.mp4",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/videoapi-demo/video/upload/f_auto,q_auto/v1/fai1n9brqkg3vxpdd8ef.mp4",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/videoapi-demo/video/upload/f_auto,q_auto/v1/fai1n9brqkg3vxpdd8ef.mp4",
  },
];

const VideoItem = ({ video, isActive }: { video: any; isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Сброс времени на начало
      }
    }
  }, [isActive]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current && !isSeeking) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        setProgress((currentTime / duration) * 100);
      }
    };

    videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isSeeking]);

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsSeeking(false);
    if (videoRef.current) {
      const clickX = event.nativeEvent.offsetX;
      const barWidth = event.currentTarget.clientWidth;
      const newTime = (clickX / barWidth) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress((newTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeeking = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isSeeking && videoRef.current) {
      const clickX = event.nativeEvent.offsetX;
      const barWidth = event.currentTarget.clientWidth;
      const newTime = (clickX / barWidth) * videoRef.current.duration;
      setProgress((newTime / videoRef.current.duration) * 100);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        src={video.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        playsInline
        muted
        controls={false}
        preload="auto"
      />
      {isActive && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "4px",
              background: "rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              zIndex: 2,
            }}
            onMouseDown={handleSeekStart}
            onMouseMove={handleSeeking}
            onMouseUp={handleSeekEnd}
            onMouseLeave={() => setIsSeeking(false)}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "red",
                transition: isSeeking ? "none" : "width 0.2s",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

const VideoShorts = () => {
  const [videos, setVideos] = useState(initialVideos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: "up" | "down") => {
    if (direction === "up" && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex > 0) {
          // Удаляем предыдущие видео
          setVideos((prevVideos) => prevVideos.slice(newIndex));
        }
        return newIndex;
      });
    } else if (direction === "down" && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchStartY = e.touches[0].clientY;
      const handleTouchMove = (e: TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const distanceY = touchStartY - touchEndY;
        if (distanceY > 50) {
          handleSwipe("up");
        } else if (distanceY < -50) {
          handleSwipe("down");
        }
      };

      containerRef.current?.addEventListener("touchmove", handleTouchMove, {
        once: true,
      });
    };

    containerRef.current?.addEventListener("touchstart", handleTouchStart);

    return () => {
      containerRef.current?.removeEventListener("touchstart", handleTouchStart);
    };
  }, [currentVideoIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        backgroundColor: "black",
        WebkitOverflowScrolling: "touch", // плавная прокрутка для iOS
      }}
      onScroll={(e) => {
        const { scrollTop, clientHeight } = e.currentTarget;
        const newIndex = Math.round(scrollTop / clientHeight);
        if (newIndex !== currentVideoIndex) {
          setCurrentVideoIndex(newIndex);
        }
      }}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          style={{
            scrollSnapAlign: "start",
            height: "100vh",
          }}
        >
          <VideoItem video={video} isActive={currentVideoIndex === index} />
        </div>
      ))}
    </div>
  );
};

export default VideoShorts;
