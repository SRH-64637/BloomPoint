"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/ui/VideoPlayer";
import {
  Play,
  Clock,
  User,
  Tag,
  ExternalLink,
  BookOpen,
  Video as VideoIcon,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

type VideoLecture = {
  title: string;
  description?: string;
  videoUrl: string;
  videoType: "youtube" | "vimeo" | "embed" | "file";
  duration?: number;
  thumbnail?: string;
  order: number;
  isPreview?: boolean;
};

type Resource = {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: "course" | "blog" | "video" | "multi-video-course";
  videoType?: "youtube" | "vimeo" | "embed" | "file";
  tags: string[];
  thumbnail?: string;
  featured: boolean;
  videoLectures?: VideoLecture[];
  totalDuration?: number;
  lectureCount?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration?: number;
  progress?: number;
  createdBy: string; // Clerk user ID
  views: number;
  likes: number;
  bookmarks: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
};

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLecture, setCurrentLecture] = useState<VideoLecture | null>(
    null
  );
  const [completedLectures, setCompletedLectures] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  async function fetchCourse() {
    try {
      const res = await fetch(`/api/resources/${params.id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Course not found");

      const data = await res.json();
      setCourse(data.resource);

      // Set first lecture as current for multi-video courses
      if (
        data.resource.type === "multi-video-course" &&
        data.resource.videoLectures?.length > 0
      ) {
        setCurrentLecture(data.resource.videoLectures[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function markLectureComplete(lectureOrder: number) {
    setCompletedLectures((prev) => new Set([...prev, lectureOrder]));
  }

  function getProgressPercentage() {
    if (!course?.videoLectures) return 0;
    return Math.round(
      (completedLectures.size / course.videoLectures.length) * 100
    );
  }

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6 pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-700 rounded mb-8"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen p-6 pt-24">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-400">{error || "Course not found"}</p>
        </div>
      </main>
    );
  }

  const isMultiVideoCourse = course.type === "multi-video-course";

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-black/95 to-gray-900/95">
      <div className="mx-auto max-w-6xl">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Course</span>
            <ChevronRight className="w-4 h-4" />
            <span>{course.title}</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
          <p className="text-lg text-gray-300 mb-6">{course.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            {course.difficulty && (
              <Badge variant="outline" className="text-white border-white/20">
                {course.difficulty}
              </Badge>
            )}
            {course.duration && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            )}
            {isMultiVideoCourse && course.lectureCount && (
              <div className="flex items-center gap-2 text-gray-400">
                <VideoIcon className="w-4 h-4" />
                <span>{course.lectureCount} lectures</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span>User {course.createdBy?.slice(-6)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {isMultiVideoCourse && currentLecture ? (
              /* Multi-video course player */
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <VideoIcon className="w-5 h-5" />
                    {currentLecture.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoPlayer
                    videoUrl={currentLecture.videoUrl}
                    videoType={currentLecture.videoType}
                    title={currentLecture.title}
                    className="mb-4"
                  />

                  {currentLecture.description && (
                    <p className="text-gray-300 text-sm mb-4">
                      {currentLecture.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {currentLecture.duration
                          ? formatDuration(currentLecture.duration)
                          : "Duration not specified"}
                      </span>
                    </div>

                    <Button
                      onClick={() => markLectureComplete(currentLecture.order)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={completedLectures.has(currentLecture.order)}
                    >
                      {completedLectures.has(currentLecture.order) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Regular course content */
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.thumbnail && (
                    <div className="mb-6">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <p className="text-gray-300">
                      This course is available on an external platform. Click
                      the link below to access the course content.
                    </p>

                    <Button
                      asChild
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <a
                        href={course.content}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Course
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Description */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {course.description}
                </p>

                {course.tags && course.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Topics Covered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
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
            {/* Progress Card */}
            {isMultiVideoCourse && (
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {getProgressPercentage()}%
                      </span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                    <div className="text-center text-sm text-gray-400">
                      {completedLectures.size} of {course.videoLectures?.length}{" "}
                      lectures completed
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Info */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">
                    {course.type.replace("-", " ")}
                  </span>
                </div>
                {course.difficulty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="text-white capitalize">
                      {course.difficulty}
                    </span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">
                      {formatDuration(course.duration)}
                    </span>
                  </div>
                )}
                {course.lectureCount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Lectures</span>
                    <span className="text-white">{course.lectureCount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Lecture List for Multi-video courses */}
            {isMultiVideoCourse && course.videoLectures && (
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Course Lectures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {course.videoLectures
                      .sort((a, b) => a.order - b.order)
                      .map((lecture) => (
                        <button
                          key={lecture.order}
                          onClick={() => setCurrentLecture(lecture)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            currentLecture?.order === lecture.order
                              ? "bg-emerald-600/20 border border-emerald-500/30"
                              : "bg-black/20 hover:bg-black/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  completedLectures.has(lecture.order)
                                    ? "bg-emerald-600"
                                    : "bg-gray-600"
                                }`}
                              >
                                {completedLectures.has(lecture.order) ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <span className="text-xs text-white">
                                    {lecture.order + 1}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium truncate">
                                  {lecture.title}
                                </div>
                                {lecture.duration && (
                                  <div className="text-gray-400 text-xs">
                                    {formatDuration(lecture.duration)}
                                  </div>
                                )}
                              </div>
                            </div>
                            {lecture.isPreview && (
                              <Badge
                                variant="outline"
                                className="text-xs text-emerald-400 border-emerald-400"
                              >
                                Preview
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
