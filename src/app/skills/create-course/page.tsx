"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Tag,
  Star,
  ExternalLink,
  Clock,
} from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "", // URL to external course
    tags: [] as string[],
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    duration: 0,
    featured: false,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Course title is required";
    if (!form.description.trim()) return "Course description is required";
    if (!form.content.trim()) return "Course URL is required";
    if (form.tags.length === 0) return "At least one tag is required";

    // Basic URL validation
    try {
      new URL(form.content);
    } catch {
      return "Please enter a valid URL";
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

    try {
      const payload = {
        title: form.title,
        description: form.description,
        content: form.content, // URL to external course
        type: "course" as const,
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
          throw new Error("Please log in to create a course.");
        } else if (res.status === 400) {
          throw new Error(
            `Invalid data: ${data.error || "Please check your input"}`
          );
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
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <GraduationCap className="w-8 h-8" />
            Create Course Resource
          </h1>
          <p className="text-gray-400">
            Share external courses and learning resources with the community
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
          {/* Course Basic Info */}
          <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Course Title *
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
                  placeholder="Brief description of the course"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Course URL *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    className="flex-1 p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                    placeholder="https://example.com/course"
                  />
                  <Button
                    type="button"
                    onClick={() => window.open(form.content, "_blank")}
                    disabled={!form.content}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <ExternalLink size={16} />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Link to the external course (Coursera, Udemy, etc.)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Duration (minutes)
                  </label>
                  <div className="flex items-center gap-2">
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
                      className="flex-1 p-3 border border-white/10 bg-black/20 rounded-lg text-white"
                      placeholder="Duration"
                    />
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

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
                <span className="text-sm">Feature this course</span>
              </label>
            </CardContent>
          </Card>

          {/* Course Preview */}
          {form.content && (
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Course Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">
                      External Course
                    </span>
                  </div>
                  <p className="text-white font-medium mb-2">
                    {form.title || "Course Title"}
                  </p>
                  <p className="text-gray-300 text-sm mb-3">
                    {form.description || "Course description will appear here"}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {form.difficulty && (
                      <Badge variant="outline" className="text-xs">
                        {form.difficulty}
                      </Badge>
                    )}
                    {form.duration > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(form.duration / 60)}h {form.duration % 60}m
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Course...
              </>
            ) : (
              <>
                <GraduationCap size={18} />
                Create Course Resource
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}




