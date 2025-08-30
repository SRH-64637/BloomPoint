"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowLeft,
  Monitor,
  Clock,
  Star,
  Eye,
  Heart,
  Play,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  videoType?: string;
  tags: string[];
  difficulty?: string;
  duration?: number;
  views: number;
  likes: number;
  rating?: number;
  createdAt: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedVideoType, setSelectedVideoType] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/resources?type=video", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideos(data.resources || []);
    } catch (err: any) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDifficulty =
      !selectedDifficulty || video.difficulty === selectedDifficulty;

    const matchesDuration =
      !selectedDuration ||
      (selectedDuration === "short" &&
        (!video.duration || video.duration < 10)) ||
      (selectedDuration === "medium" &&
        video.duration &&
        video.duration >= 10 &&
        video.duration <= 30) ||
      (selectedDuration === "long" && video.duration && video.duration > 30);

    const matchesVideoType =
      !selectedVideoType || video.videoType === selectedVideoType;

    return (
      matchesSearch && matchesDifficulty && matchesDuration && matchesVideoType
    );
  });

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "Duration not specified";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-10 bg-gray-700 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Error Loading Videos
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchVideos} className="mr-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/skills">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Skills
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Skills
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Monitor className="w-8 h-8 text-purple-400" />
            All Videos
          </h1>
          <p className="text-muted-foreground text-lg">
            Watch and learn from curated video content
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search videos by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-black/20 border border-white/10 text-white rounded-md focus:border-white/30"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="px-3 py-2 bg-black/20 border border-white/10 text-white rounded-md focus:border-white/30"
              >
                <option value="">All Durations</option>
                <option value="short">Under 10 min</option>
                <option value="medium">10-30 min</option>
                <option value="long">Over 30 min</option>
              </select>
              <select
                value={selectedVideoType}
                onChange={(e) => setSelectedVideoType(e.target.value)}
                className="px-3 py-2 bg-black/20 border border-white/10 text-white rounded-md focus:border-white/30"
              >
                <option value="">All Types</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="embed">Embed</option>
                <option value="file">File Upload</option>
              </select>
            </div>
          </div>

          {searchTerm ||
          selectedDifficulty ||
          selectedDuration ||
          selectedVideoType ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>
                Showing {filteredVideos.length} of {videos.length} videos
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("");
                  setSelectedDuration("");
                  setSelectedVideoType("");
                }}
                className="text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No videos found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ||
              selectedDifficulty ||
              selectedDuration ||
              selectedVideoType
                ? "Try adjusting your search or filters"
                : "No videos have been created yet"}
            </p>
            <Link href="/skills/create">
              <Button>Create Your First Video</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Link key={video._id} href={`/skills/videos/${video._id}`}>
                <Card className="group cursor-pointer overflow-hidden border-white/10 bg-black/20 hover:bg-black/30 transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(video.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {video.tags?.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {video.difficulty && (
                          <Badge variant="outline" className="text-xs">
                            {video.difficulty}
                          </Badge>
                        )}
                        {video.videoType && (
                          <Badge
                            variant="outline"
                            className="text-xs text-purple-400"
                          >
                            {video.videoType}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{video.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(video.createdAt)}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{video.likes}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Create Video Button */}
        <div className="text-center mt-12">
          <Link href="/skills/create">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Create New Video
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
