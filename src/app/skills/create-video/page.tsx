"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Tag,
  Star,
  Upload,
  Play,
} from "lucide-react";

interface VideoForm {
  title: string;
  description: string;
  videoType: "youtube" | "vimeo" | "embed" | "file";
  videoUrl: string;
  videoFile?: File;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  featured: boolean;
}

export default function CreateVideoPage() {
  const router = useRouter();
  const [form, setForm] = useState<VideoForm>({
    title: "",
    description: "",
    videoType: "file",
    videoUrl: "",
    tags: [],
    difficulty: "beginner",
    duration: 0,
    featured: false,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const addTag = () => {
    const tag = tagsInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const uploadVideo = async (file: File): Promise<string> => {
    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      throw new Error(`File size too large. Maximum size is 100MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "videos");

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
    if (!form.title.trim()) return "Video title is required";
    if (!form.description.trim()) return "Video description is required";
    if (form.tags.length === 0) return "At least one tag is required";

    if (form.videoType === "file" && !form.videoFile) {
      return "Please select a video file";
    }

    if (form.videoType !== "file" && !form.videoUrl.trim()) {
      return "Video URL is required";
    }

    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setUploading(true);

    try {
      let finalVideoUrl = form.videoUrl;

      // Upload file if needed
      if (form.videoType === "file" && form.videoFile) {
        finalVideoUrl = await uploadVideo(form.videoFile);
      }

      const payload = {
        title: form.title,
        description: form.description,
        content: finalVideoUrl, // For videos, content is the video URL
        type: "video" as const,
        videoType: form.videoType,
        tags: form.tags,
        difficulty: form.difficulty,
        duration: form.duration,
        featured: form.featured,
      };

      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please log in to create a video.");
        } else if (res.status === 400) {
          throw new Error(
            `Invalid data: ${data.error || "Please check your input"}`
          );
        } else {
          throw new Error(
            data?.error || `Failed to create video (status ${res.status})`
          );
        }
      }

      setSuccess("Video created successfully! Redirecting...");
      setTimeout(() => {
        router.push(`/skills/videos/${data.resource._id}`);
      }, 1500);
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Video className="w-8 h-8" />
            Create Video Resource
          </h1>
          <p className="text-gray-400">
            Share your knowledge through video content
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertCircle size={20} />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-red-400">{error}</p>
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
          {/* Video Basic Info */}
          <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Video Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                  placeholder="Video title"
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
                  placeholder="Brief description of your video"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Video Type
                  </label>
                  <select
                    value={form.videoType}
                    onChange={(e) =>
                      setForm({ ...form, videoType: e.target.value as any })
                    }
                    className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                  >
                    <option value="file">File Upload</option>
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="embed">Embed Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                    placeholder="Duration"
                  />
                </div>
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

              {/* Video Input Section */}
              {form.videoType === "file" ? (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Video File *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setForm({ ...form, videoFile: file });
                      }}
                      className="flex-1 text-white"
                    />
                    {uploadProgress > 0 && (
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
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
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {form.videoType === "youtube"
                      ? "YouTube URL"
                      : form.videoType === "vimeo"
                      ? "Vimeo URL"
                      : "Embed Code"}{" "}
                    *
                  </label>
                  <input
                    value={form.videoUrl}
                    onChange={(e) =>
                      setForm({ ...form, videoUrl: e.target.value })
                    }
                    className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                    placeholder={
                      form.videoType === "youtube"
                        ? "https://youtube.com/..."
                        : form.videoType === "vimeo"
                        ? "https://vimeo.com/..."
                        : "Embed code"
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Tags *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                    placeholder="Add tags (press Enter)"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Tag size={12} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <Star size={16} />
                <span className="text-sm">Feature this video</span>
              </label>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Video...
              </>
            ) : uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading Video...
              </>
            ) : (
              <>
                <Video size={18} />
                Create Video Resource
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}



