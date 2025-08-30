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
  FileText,
  Clock,
  Star,
  Eye,
  Heart,
} from "lucide-react";

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
  difficulty?: string;
  duration?: number;
  views: number;
  likes: number;
  rating?: number;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/resources?type=blog");
      const data = await response.json();
      setBlogs(data.resources || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDifficulty =
      !selectedDifficulty || blog.difficulty === selectedDifficulty;

    const matchesDuration =
      !selectedDuration ||
      (selectedDuration === "short" &&
        (!blog.duration || blog.duration < 15)) ||
      (selectedDuration === "medium" &&
        blog.duration &&
        blog.duration >= 15 &&
        blog.duration <= 30) ||
      (selectedDuration === "long" && blog.duration && blog.duration > 30);

    return matchesSearch && matchesDifficulty && matchesDuration;
  });

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "Reading time not specified";
    if (minutes < 15) return `${minutes} min read`;
    if (minutes < 60) return `${minutes} min read`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m read`
      : `${hours}h read`;
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
            <FileText className="w-8 h-8 text-blue-400" />
            All Blogs & Articles
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore insightful articles and guides to enhance your learning
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search blogs by title, description, or tags..."
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
                <option value="">All Reading Times</option>
                <option value="short">Under 15 min</option>
                <option value="medium">15-30 min</option>
                <option value="long">Over 30 min</option>
              </select>
            </div>
          </div>

          {searchTerm || selectedDifficulty || selectedDuration ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>
                Showing {filteredBlogs.length} of {blogs.length} blogs
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("");
                  setSelectedDuration("");
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No blogs found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedDifficulty || selectedDuration
                ? "Try adjusting your search or filters"
                : "No blogs have been created yet"}
            </p>
            <Link href="/skills/create">
              <Button>Create Your First Blog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Link key={blog._id} href={`/skills/blogs/${blog._id}`}>
                <Card className="group cursor-pointer overflow-hidden border-white/10 bg-black/20 hover:bg-black/30 transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 text-lg group-hover:text-blue-400 transition-colors">
                          {blog.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground ml-2">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="text-xs">
                          {blog.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {blog.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags?.slice(0, 4).map((tag) => (
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
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(blog.duration)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">{blog.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs">{blog.likes}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Create Blog Button */}
        <div className="text-center mt-12">
          <Link href="/skills/create">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Create New Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
