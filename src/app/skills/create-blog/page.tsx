"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Tag,
  Star,
} from "lucide-react";

export default function CreateBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: [] as string[],
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
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
    if (!form.title.trim()) return "Blog title is required";
    if (!form.description.trim()) return "Blog description is required";
    if (!form.content.trim()) return "Blog content is required";
    if (form.tags.length === 0) return "At least one tag is required";
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
        content: form.content,
        type: "blog" as const,
        tags: form.tags,
        difficulty: form.difficulty,
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
          throw new Error("Please log in to create a blog.");
        } else if (res.status === 400) {
          throw new Error(
            `Invalid data: ${data.error || "Please check your input"}`
          );
        } else {
          throw new Error(
            data?.error || `Failed to create blog (status ${res.status})`
          );
        }
      }

      setSuccess("Blog created successfully! Redirecting...");
      setTimeout(() => {
        router.push(`/skills/blogs/${data.resource._id}`);
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
            <FileText className="w-8 h-8" />
            Create Blog Post
          </h1>
          <p className="text-gray-400">
            Share your knowledge and insights with the community
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
          {/* Blog Basic Info */}
          <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Blog Information</CardTitle>
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
                  placeholder="Blog title"
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
                  placeholder="Brief description of your blog post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Content *
                </label>
                <textarea
                  rows={12}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full p-3 border border-white/10 bg-black/20 rounded-lg text-white font-mono"
                  placeholder="Write your blog content here... (Markdown supported)"
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can use Markdown formatting for rich text
                </p>
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
                <span className="text-sm">Feature this blog post</span>
              </label>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Blog...
              </>
            ) : (
              <>
                <FileText size={18} />
                Create Blog Post
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}




