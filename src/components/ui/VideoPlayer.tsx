// components/VideoPlayer.tsx
"use client";

import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  videoType: "youtube" | "vimeo" | "embed" | "file";
  title: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  videoType,
  title,
  className = "",
  autoPlay = false,
  showControls = true,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = (message: string) => {
    setIsLoading(false);
    setError(message);
  };

  const renderPlayer = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Video Error</h3>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      );
    }

    switch (videoType) {
      case "youtube":
        // Extract YouTube ID from various URL formats
        let youtubeId = null;

        // Standard formats
        const patterns = [
          // youtu.be format
          /youtu\.be\/([^"&?\/\s]{11})/,
          // youtube.com embed format
          /youtube\.com\/embed\/([^"&?\/\s]{11})/,
          // youtube.com watch format
          /youtube\.com\/watch\?v=([^"&?\/\s]{11})/,
          // youtube.com v format
          /youtube\.com\/v\/([^"&?\/\s]{11})/,
          // youtube.com live format
          /youtube\.com\/live\/([^"&?\/\s]{11})/,
          // youtube.com shorts format
          /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
          // with additional parameters
          /youtube\.com\/watch\?.*v=([^"&?\/\s]{11})/,
          // youtu.be with parameters
          /youtu\.be\/([^"&?\/\s]{11})\?/,
        ];

        // Try each pattern
        for (const pattern of patterns) {
          const match = videoUrl.match(pattern);
          if (match && match[1]) {
            youtubeId = match[1];
            break;
          }
        }

        // Additional check for share URLs and other formats
        if (!youtubeId) {
          // Handle youtu.be without https
          if (videoUrl.includes("youtu.be/")) {
            const parts = videoUrl.split("youtu.be/");
            if (parts[1]) {
              const idPart = parts[1].split(/[?&\/\s]/)[0];
              if (idPart && idPart.length === 11) {
                youtubeId = idPart;
              }
            }
          }
          // Handle full YouTube URLs
          else if (videoUrl.includes("youtube.com/")) {
            const urlObj = new URL(videoUrl);
            const searchParams = new URLSearchParams(urlObj.search);
            youtubeId = searchParams.get("v");
          }
        }

        if (!youtubeId || youtubeId.length !== 11) {
          handleError("Invalid YouTube URL. Please check the format.");
          return null;
        }

        return (
          <div className="relative w-full h-0 pb-[56.25%]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${
                autoPlay ? 1 : 0
              }&rel=0&modestbranding=1`}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleLoad}
              onError={() => handleError("Failed to load YouTube video")}
            />
          </div>
        );
      case "vimeo":
        const vimeoId = videoUrl.match(
          /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/
        )?.[1];
        if (!vimeoId) {
          handleError("Invalid Vimeo URL");
          return null;
        }
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${
              autoPlay ? 1 : 0
            }&title=0&byline=0&portrait=0`}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            title={title}
            onLoad={handleLoad}
            onError={() => handleError("Failed to load Vimeo video")}
          />
        );

      case "embed":
        return (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: videoUrl }}
            onLoad={handleLoad}
          />
        );

      case "file":
        return (
          <video
            controls={showControls}
            className="w-full h-full"
            preload="metadata"
            autoPlay={autoPlay}
            muted={isMuted}
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={handleLoad}
            onError={() => handleError("Failed to load video file")}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        );

      default:
        handleError("Unsupported video type");
        return null;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    const video = document.querySelector("video");
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector(".video-player-container");
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  return (
    <div
      className={`video-player-container aspect-video bg-black rounded-lg overflow-hidden relative ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {renderPlayer()}

      {/* Custom controls for file videos */}
      {videoType === "file" && showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Maximize className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Video title overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
        <h3 className="text-white font-medium text-sm truncate">{title}</h3>
      </div>
    </div>
  );
}

// Add this function outside your component
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Trim and clean the URL
  const cleanUrl = url.trim();
  
  // List of regex patterns to try
  const patterns = [
    /(?:youtube\.com\/embed\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/watch\?v=)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/v\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/live\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/shorts\/)([^"&?\/\s]{11})/,
    /(?:youtu\.be\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/watch\?.*v=)([^"&?\/\s]{11})/,
  ];

  // Try each pattern
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Try URL parsing approach
  try {
    // Handle youtu.be URLs
    if (cleanUrl.includes('youtu.be/')) {
      const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      const pathParts = urlObj.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id.length === 11) {
        return id;
      }
    }
    
    // Handle youtube.com URLs
    if (cleanUrl.includes('youtube.com/')) {
      const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      return urlObj.searchParams.get('v');
    }
  } catch (e) {
    console.error('URL parsing error:', e);
  }

  return null;
};