"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/ui/VideoPlayer";
import {
  Play,
  Clock,
  User,
  Tag,
  BookOpen,
  Video as VideoIcon,
  ChevronRight,
  ThumbsUp,
  Bookmark,
  Eye,
  ArrowLeft,
  Share2,
  AlertCircle,
} from "lucide-react";

type Resource = {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: "course" | "blog" | "video" | "multi-video-course";
  videoType: "youtube" | "vimeo" | "embed" | "file";
  tags: string[];
  thumbnail?: string;
  featured: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration?: number;
  createdBy: string; // Clerk user ID
  views: number;
  likes: number;
  bookmarks: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
};

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchVideo();
    }
  }, [params.id]);

  async function fetchVideo() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/resources/${params.id}`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch video");
      }

      const data = await res.json();

      if (data.resource.type !== "video") {
        throw new Error("This resource is not a video");
      }

      setVideo(data.resource);

      // TODO: Check if user has liked/bookmarked this video
      // setIsLiked(userLiked);
      // setIsBookmarked(userBookmarked);
    } catch (err: any) {
      console.error("Fetch video error:", err);
      setError(err.message || "Failed to load video");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike() {
    try {
      setActionLoading(true);
      // TODO: Implement like API call
      setIsLiked(!isLiked);
      // Optimistic update
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              likes: prev.likes + (isLiked ? -1 : 1),
            }
          : null
      );
    } catch (err) {
      console.error("Like error:", err);
      // Revert optimistic update
      setIsLiked(!isLiked);
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              likes: prev.likes + (isLiked ? 1 : -1),
            }
          : null
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBookmark() {
    try {
      setActionLoading(true);
      // TODO: Implement bookmark API call
      setIsBookmarked(!isBookmarked);
      // Optimistic update
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              bookmarks: prev.bookmarks + (isBookmarked ? -1 : 1),
            }
          : null
      );
    } catch (err) {
      console.error("Bookmark error:", err);
      // Revert optimistic update
      setIsBookmarked(!isBookmarked);
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              bookmarks: prev.bookmarks + (isBookmarked ? 1 : -1),
            }
          : null
      );
    } finally {
      setActionLoading(false);
    }
  }

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        text: video?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-black/95 to-gray-900/95">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="aspect-video bg-gray-700 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-20 bg-gray-700 rounded"></div>
                <div className="h-40 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-40 bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !video) {
    return (
      <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-black/95 to-gray-900/95">
        <div className="mx-auto max-w-6xl text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-8">{error || "Video not found"}</p>
          <Button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={fetchVideo} variant="outline">
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-black/95 to-gray-900/95">
      <div className="mx-auto max-w-6xl">
        {/* Navigation */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <VideoIcon className="w-4 h-4" />
            <span>Video</span>
            <ChevronRight className="w-4 h-4" />
            <span className="truncate">{video.title}</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">{video.title}</h1>
          <p className="text-lg text-gray-300 mb-6">{video.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            {video.difficulty && (
              <Badge variant="outline" className="text-white border-white/20">
                {video.difficulty}
              </Badge>
            )}
            {video.duration && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(video.duration)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span>User {video.createdBy?.slice(-6)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm mb-6">
              <CardContent className="p-0">
                <VideoPlayer
                  videoUrl={video.content}
                  videoType={video.videoType}
                  title={video.title}
                  className="rounded-t-lg"
                  autoPlay={false}
                  showControls={true}
                />
              </CardContent>
            </Card>

            {/* Video Actions */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleLike}
                      disabled={actionLoading}
                      variant={isLiked ? "default" : "outline"}
                      className={`flex items-center gap-2 ${
                        isLiked
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {video.likes + (isLiked ? 1 : 0)}
                    </Button>

                    <Button
                      onClick={handleBookmark}
                      disabled={actionLoading}
                      variant={isBookmarked ? "default" : "outline"}
                      className={`flex items-center gap-2 ${
                        isBookmarked
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      {video.bookmarks + (isBookmarked ? 1 : 0)}
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{video.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Description */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">About This Video</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {video.description}
                </p>

                {video.tags && video.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Topics Covered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-white/10 text-white hover:bg-white/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Info */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Video Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">
                    {video.videoType}
                  </span>
                </div>
                {video.difficulty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="text-white capitalize">
                      {video.difficulty}
                    </span>
                  </div>
                )}
                {video.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {video.rating && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rating</span>
                    <span className="text-white">{video.rating}/5</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">U</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      User {video.createdBy?.slice(-6)}
                    </div>
                    <div className="text-gray-400 text-sm">Creator</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Videos Placeholder */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Related Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <VideoIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    More videos coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
