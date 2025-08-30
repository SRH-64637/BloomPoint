// app/skills/create-multi-video/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  Upload,
  Play,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface VideoLecture {
  title: string;
  description: string;
  videoFile?: File;
  videoUrl: string;
  videoType: "youtube" | "vimeo" | "embed" | "file";
  duration: number;
  order: number;
  isPreview: boolean;
  uploadProgress?: number;
}

export default function CreateMultiVideoCourse() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    featured: false,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detailedError, setDetailedError] = useState<any>(null);

  const addLecture = () => {
    setLectures([
      ...lectures,
      {
        title: "",
        description: "",
        videoUrl: "",
        videoType: "file",
        duration: 0,
        order: lectures.length + 1,
        isPreview: false,
      },
    ]);
  };

  const removeLecture = (index: number) => {
    setLectures(lectures.filter((_, i) => i !== index));
  };

  const updateLecture = (
    index: number,
    field: keyof VideoLecture,
    value: any
  ) => {
    const updatedLectures = [...lectures];
    updatedLectures[index] = { ...updatedLectures[index], [field]: value };
    setLectures(updatedLectures);
  };

  const uploadVideo = async (
    file: File,
    lectureIndex: number
  ): Promise<string> => {
    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      throw new Error(`File size too large. Maximum size is 100MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "course-lectures");

    try {
      const response = await fetch("/api/upload/video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Upload failed with status ${response.status}`
        );
      }

      const data = await response.json();
      return data.result.secure_url;
    } catch (err: any) {
      console.error("Upload error details:", err);
      if (err.message.includes("Unauthorized")) {
        throw new Error("Please log in to upload videos.");
      } else if (err.message.includes("Failed to upload video")) {
        throw new Error(
          "Video upload failed. Please check your file size and format."
        );
      } else if (err.message.includes("Cloudinary")) {
        throw new Error(
          "Video service is temporarily unavailable. Please try again later."
        );
      } else {
        throw new Error("Upload failed. Please try again.");
      }
    }
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Course title is required";
    if (!form.description.trim()) return "Course description is required";
    if (lectures.length === 0) return "At least one lecture is required";

    for (const lecture of lectures) {
      if (!lecture.title.trim()) return "All lectures must have a title";
      if (!lecture.videoUrl && !lecture.videoFile) {
        return "All lectures must have a video";
      }
    }

    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDetailedError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setUploading(true);

    try {
      // === REPLACE THIS SECTION ===
      // Upload all videos first with better error handling
      const lecturesWithUrls = [];
      const uploadErrors: { index: number; error: string }[] = [];

      for (let i = 0; i < lectures.length; i++) {
        const lecture = lectures[i];
        let videoUrl = lecture.videoUrl;

        if (lecture.videoFile) {
          try {
            videoUrl = await uploadVideo(lecture.videoFile, i);
          } catch (err: any) {
            console.error(`Failed to upload lecture ${i + 1}:`, err);
            uploadErrors.push({ index: i, error: err.message });
            continue; // Skip this lecture but continue with others
          }
        }

        lecturesWithUrls.push({
          ...lecture,
          videoUrl,
          videoType: lecture.videoType as
            | "youtube"
            | "vimeo"
            | "embed"
            | "file",
        });
      }

      // Check if any uploads failed
      if (uploadErrors.length > 0) {
        const errorMessages = uploadErrors
          .map((e) => `Lecture ${e.index + 1}: ${e.error}`)
          .join("\n");

        throw new Error(`Some lectures failed to upload:\n${errorMessages}`);
      }

      // Create the course
      // Remove the 'level' field as it doesn't exist in the backend
      const payload = {
        title: form.title,
        description: form.description,
        content: "Multi-video course overview",
        type: "multi-video-course" as const,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        difficulty: form.difficulty, // Only use difficulty, not level
        featured: form.featured,
        duration: lectures.reduce(
          (total, lecture) => total + (lecture.duration || 0),
          0
        ),
        videoLectures: lecturesWithUrls.map((lecture) => ({
          title: lecture.title,
          description: lecture.description || "", // Ensure description is always a string
          videoUrl: lecture.videoUrl,
          videoType: lecture.videoType,
          duration: lecture.duration || 0, // Ensure duration is always a number
          order: lecture.order,
          isPreview: lecture.isPreview || false, // Ensure isPreview is always boolean
        })),
      };

      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error response:", data);

        if (res.status === 401) {
          throw new Error("Please log in to create a course.");
        } else if (res.status === 400) {
          throw new Error(
            `Invalid data: ${data.error || "Please check your input"}`
          );
        } else if (res.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(
            data?.error || `Failed to create course (status ${res.status})`
          );
        }
      }

      setSuccess("Course created successfully! Redirecting...");
      setTimeout(() => {
        router.push(`/skills/courses/${data.resource._id}`);
      }, 1500);
    } catch (e: any) {
      console.error("Full error details:", e);
      setDetailedError(e);

      if (e.message.includes("Upload failed")) {
        setError(
          "Video upload failed. Please check your file size and format."
        );
      } else if (e.message.includes("Unauthorized")) {
        setError("Please log in to create a course.");
      } else if (e.message.includes("Failed to create resource")) {
        setError("Failed to save course. Please check your data.");
      } else if (e.message.includes("Invalid data")) {
        setError(e.message);
      } else if (e.message.includes("Server error")) {
        setError(
          "Our servers are experiencing issues. Please try again later."
        );
      } else {
        setError(e?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Create Multi-Video Course
        </h1>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertCircle size={20} />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-red-400">{error}</p>
            {detailedError && (
              <details className="mt-2 text-sm text-red-300">
                <summary className="cursor-pointer">Technical details</summary>
                <pre className="mt-2 p-2 bg-red-900/30 rounded overflow-auto">
                  {JSON.stringify(detailedError, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle size={20} />
              <h3 className="font-semibold">Success!</h3>
            </div>
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Course Basic Info */}
          <div className="bg-white/5 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Course Information
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                  placeholder="Course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                  placeholder="Course description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({ ...form, difficulty: e.target.value as any })
                  }
                  className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Tags (comma separated)
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                  placeholder="react, javascript, web-development"
                />
              </div>
            </div>
          </div>

          {/* Video Lectures */}
          <div className="bg-white/5 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Video Lectures
              </h2>
              <button
                type="button"
                onClick={addLecture}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 text-white"
              >
                <Plus size={16} />
                Add Lecture
              </button>
            </div>

            <div className="space-y-4">
              {lectures.map((lecture, index) => (
                <div
                  key={index}
                  className="border border-white/10 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-white">
                      Lecture {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeLecture(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Title *
                      </label>
                      <input
                        value={lecture.title}
                        onChange={(e) =>
                          updateLecture(index, "title", e.target.value)
                        }
                        className="w-full p-2 border border-white/10 bg-black/20 rounded text-white"
                        placeholder="Lecture title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={lecture.description}
                        onChange={(e) =>
                          updateLecture(index, "description", e.target.value)
                        }
                        className="w-full p-2 border border-white/10 bg-black/20 rounded text-white"
                        placeholder="Lecture description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                          Video Type
                        </label>
                        <select
                          value={lecture.videoType}
                          onChange={(e) =>
                            updateLecture(index, "videoType", e.target.value)
                          }
                          className="w-full p-2 border border-white/10 bg-black/20 rounded text-white"
                        >
                          <option value="file">File Upload</option>
                          <option value="youtube">YouTube</option>
                          <option value="vimeo">Vimeo</option>
                          <option value="embed">Embed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={lecture.duration}
                          onChange={(e) =>
                            updateLecture(
                              index,
                              "duration",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 border border-white/10 bg-black/20 rounded text-white"
                          placeholder="Duration"
                        />
                      </div>
                    </div>

                    {lecture.videoType === "file" ? (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                          Video File *
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) updateLecture(index, "videoFile", file);
                            }}
                            className="flex-1 text-white"
                          />
                          {lecture.uploadProgress !== undefined && (
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full transition-all"
                                style={{ width: `${lecture.uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Supported formats: MP4, MOV, AVI. Max size: 100MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                          {lecture.videoType === "youtube"
                            ? "YouTube URL"
                            : lecture.videoType === "vimeo"
                            ? "Vimeo URL"
                            : "Embed Code"}{" "}
                          *
                        </label>
                        <input
                          value={lecture.videoUrl}
                          onChange={(e) =>
                            updateLecture(index, "videoUrl", e.target.value)
                          }
                          className="w-full p-2 border border-white/10 bg-black/20 rounded text-white"
                          placeholder={
                            lecture.videoType === "youtube"
                              ? "https://youtube.com/..."
                              : lecture.videoType === "vimeo"
                              ? "https://vimeo.com/..."
                              : "Embed code"
                          }
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={lecture.isPreview}
                        onChange={(e) =>
                          updateLecture(index, "isPreview", e.target.checked)
                        }
                        className="rounded"
                      />
                      <span className="text-sm">
                        Make this lecture previewable (free to watch)
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Course...
              </>
            ) : uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading Videos...
              </>
            ) : (
              "Create Multi-Video Course"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
