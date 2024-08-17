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
    src: "https://res.cloudinary.com/videoapi-demo/video/upload/f_auto,q_auto/v1/bxtm6wilwienc3wxhudy.mp4",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/videoapi-demo/video/upload/f_auto,q_auto/v1/chldaenaaoiiipmqwjln.mp4",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/videoapi-demo/video/upload/e_previewf_auto,q_auto/v1/fai1n9brqkg3vxpdd8ef.mp4",
  },
];

const VideoItem = ({ video, isActive, preload }: { video: any; isActive: boolean; preload?: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
          } else {
            setIsVideoVisible(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && isVideoVisible) {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch((err) => console.error("Play error: ", err));
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive, isVideoVisible]);

  useEffect(() => {
    const handleEnded = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play(); // Перезапуск видео
      }
    };

    videoRef.current?.addEventListener("ended", handleEnded);

    return () => {
      videoRef.current?.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current && !isSeeking) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        if (duration > 0) {
          setProgress((currentTime / duration) * 100);
        }
      }
    };

    videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isSeeking]);

  useEffect(() => {
    const handleProgress = () => {
      if (videoRef.current) {
        const buffered = videoRef.current.buffered;
        const duration = videoRef.current.duration;
        if (buffered.length > 0 && duration > 0) {
          const loaded = (buffered.end(buffered.length - 1) / duration) * 100;
          setLoaded(loaded);
        }
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false); // Видео готово к воспроизведению
    };

    videoRef.current?.addEventListener("progress", handleProgress);
    videoRef.current?.addEventListener("canplay", handleCanPlay);

    return () => {
      videoRef.current?.removeEventListener("progress", handleProgress);
      videoRef.current?.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const handleBuffering = () => {
    if (videoRef.current) {
      setIsBuffering(videoRef.current?.readyState < 4);
    }
  };

  useEffect(() => {
    videoRef.current?.addEventListener("waiting", handleBuffering);
    videoRef.current?.addEventListener("playing", handleBuffering);

    return () => {
      videoRef.current?.removeEventListener("waiting", handleBuffering);
      videoRef.current?.removeEventListener("playing", handleBuffering);
    };
  }, []);

  useEffect(() => {
    if (preload) {
      videoRef.current?.load(); // Предзагрузка видео
    }
  }, [preload]);

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

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
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
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "20px",
            zIndex: 10,
          }}
        >
          Загрузка видео...
        </div>
      )}
      <video
        ref={videoRef}
        src={isVideoVisible ? video.src : ""}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        playsInline
        muted
        controls={false}
        preload="auto"
        loop
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
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
            <div
              style={{
                width: `${loaded}%`,
                height: "100%",
                background: "rgba(255, 255, 255, 0.5)",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
          </div>
          <button
            onClick={togglePlayPause}
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              padding: "10px 20px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          {isBuffering && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                fontSize: "20px",
              }}
            >
              Буферизация...
            </div>
          )}
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
        WebkitOverflowScrolling: "touch",
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
          <VideoItem
            video={video}
            isActive={currentVideoIndex === index}
            preload={index === currentVideoIndex + 1} // Предзагрузка следующего видео
          />
        </div>
      ))}
    </div>
  );
};

export default VideoShorts;