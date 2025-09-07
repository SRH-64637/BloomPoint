"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Play, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  progress?: number;
  enrolledAt?: string;
}

export default function MyCoursesPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) return;
      
      try {
        const response = await fetch("/api/courses/enrolled");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 pt-28">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 pt-28">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
          My Courses
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Continue your learning journey
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No courses enrolled yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start your learning journey by exploring available courses
          </p>
          <Link href="/skills/courses">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse Courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">
                      {course.title}
                    </CardTitle>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  {course.progress && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {course.progress}% complete
                    </div>
                  )}
                </div>
                
                {course.progress && (
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
