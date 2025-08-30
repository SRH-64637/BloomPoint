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
  GraduationCap,
  Clock,
  Star,
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        "/api/resources?types=course,multi-video-course"
      );
      const data = await response.json();
      setCourses(data.resources || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDifficulty =
      !selectedDifficulty || course.difficulty === selectedDifficulty;

    const matchesDuration =
      !selectedDuration ||
      (selectedDuration === "short" &&
        (!course.duration || course.duration < 30)) ||
      (selectedDuration === "medium" &&
        course.duration &&
        course.duration >= 30 &&
        course.duration <= 60) ||
      (selectedDuration === "long" && course.duration && course.duration > 60);

    return matchesSearch && matchesDifficulty && matchesDuration;
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
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            All Courses
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover courses to expand your knowledge and skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search courses by title, description, or tags..."
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
                <option value="short">Under 30 min</option>
                <option value="medium">30-60 min</option>
                <option value="long">Over 1 hour</option>
              </select>
            </div>
          </div>

          {searchTerm || selectedDifficulty || selectedDuration ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>
                Showing {filteredCourses.length} of {courses.length} courses
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("");
                  setSelectedDuration("");
                }}
                className="text-emerald-400 hover:text-emerald-300"
              >
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedDifficulty || selectedDuration
                ? "Try adjusting your search or filters"
                : "No courses have been created yet"}
            </p>
            <Link href="/skills/create">
              <Button>Create Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link key={course._id} href={`/skills/courses/${course._id}`}>
                <Card className="group cursor-pointer overflow-hidden border-white/10 bg-black/20 hover:bg-black/30 transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(course.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {course.tags?.slice(0, 3).map((tag) => (
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
                      {course.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {course.difficulty}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{course.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Create Course Button */}
        <div className="text-center mt-12">
          <Link href="/skills/create">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Create New Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
