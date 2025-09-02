"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Star,
  Heart,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  MessageSquare,
} from "lucide-react";

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    thumbnail?: string;
    createdBy: {
      _id: string;
      name?: string;
      email?: string;
    };
    views: number;
    likes: number;
    bookmarks: number;
    rating?: number;
    createdAt: string;
  };
  onDelete?: (blogId: string) => void;
  showActions?: boolean;
}

export default function BlogCard({
  blog,
  onDelete,
  showActions = true,
}: BlogCardProps) {
  const { user, isLoaded } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = isLoaded && user?.id === blog.createdBy._id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/resources/${blog._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete?.(blog._id);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("Failed to delete blog post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {blog.title}
            </CardTitle>
            <p className="text-gray-300 text-sm line-clamp-3 mb-3">
              {blog.description}
            </p>
          </div>
          {blog.thumbnail && (
            <div className="ml-4 w-24 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Blog Tags */}
        <div className="flex flex-wrap gap-2">
          {blog.tags.slice(0, 5).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-purple-400/30 text-purple-400"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Blog Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.views} views
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-400" />
            {blog.likes} likes
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {blog.bookmarks} bookmarks
          </div>
          {blog.rating && blog.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              {blog.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            by {blog.createdBy.name || blog.createdBy.email || "Unknown"}
          </div>
          <div className="text-gray-400">{formatDate(blog.createdAt)}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
          <Link href={`/skills/blogs/${blog._id}`} className="flex-1">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Read More
            </Button>
          </Link>

          {showActions && isOwner && (
            <>
              <Link href={`/skills/blogs/${blog._id}/edit`}>
                <Button variant="outline" size="sm" className="border-white/20">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-red-400/40 text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
