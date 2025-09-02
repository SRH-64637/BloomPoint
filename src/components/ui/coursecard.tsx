"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Play,
  Clock,
  Star,
  Bookmark,
  Edit,
  Trash2,
  ExternalLink,
  Users,
} from "lucide-react";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    type: "course" | "video" | "multi-video-course";
    difficulty?: "beginner" | "intermediate" | "advanced";
    duration?: number;
    totalDuration?: number;
    lectureCount?: number;
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
  onDelete?: (courseId: string) => void;
  showActions?: boolean;
}

export default function CourseCard({
  course,
  onDelete,
  showActions = true,
}: CourseCardProps) {
  const { user, isLoaded } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = isLoaded && user?.id === course.createdBy._id;

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

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
    if (!confirm("Are you sure you want to delete this course?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/resources/${course._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete?.(course._id);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
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
              {course.title}
            </CardTitle>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {course.description}
            </p>
          </div>
          {course.thumbnail && (
            <div className="ml-4 w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Metadata */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-blue-400/30 text-blue-400">
            {course.type.replace("-", " ")}
          </Badge>
          {course.difficulty && (
            <Badge
              variant="outline"
              className={`border-${
                course.difficulty === "beginner"
                  ? "green"
                  : course.difficulty === "intermediate"
                  ? "yellow"
                  : "red"
              }-400/30 text-${
                course.difficulty === "beginner"
                  ? "green"
                  : course.difficulty === "intermediate"
                  ? "yellow"
                  : "red"
              }-400`}
            >
              {course.difficulty}
            </Badge>
          )}
          {course.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-white/20 text-gray-300"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.type === "multi-video-course"
              ? formatDuration(course.totalDuration)
              : formatDuration(course.duration)}
          </div>
          {course.type === "multi-video-course" && course.lectureCount && (
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              {course.lectureCount} lectures
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.views} views
          </div>
          {course.rating && course.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              {course.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            by {course.createdBy.name || course.createdBy.email || "Unknown"}
          </div>
          <div className="text-gray-400">{formatDate(course.createdAt)}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
          <Link href={`/skills/courses/${course._id}`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              View Course
            </Button>
          </Link>

          {showActions && isOwner && (
            <>
              <Link href={`/skills/courses/${course._id}/edit`}>
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
