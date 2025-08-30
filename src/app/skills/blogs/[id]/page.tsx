import dbConnect from "@/lib/dbConnect";
import { Resource } from "@/model/Resource.models";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  User,
  Calendar,
  Tag,
  Clock,
  BookOpen,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetail({ params }: PageProps) {
  const { id } = await params;
  await dbConnect();

  const resource = (await Resource.findById(id).lean()) as any;

  if (!resource || resource.type !== "blog") {
    return (
      <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-black/95 to-gray-900/95">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <Link href="/skills/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-black/95 to-gray-900/95">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <BookOpen className="w-4 h-4" />
          <span>Blogs</span>
          <ChevronRight className="w-4 h-4" />
          <span>{resource.title}</span>
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {resource.title}
          </h1>
          <p className="text-lg text-gray-300 mb-6">{resource.description}</p>

          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>User {resource.createdBy?.slice(-6)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(resource.createdAt)}</span>
            </div>
            {resource.difficulty && (
              <Badge variant="outline" className="text-white border-white/20">
                {resource.difficulty}
              </Badge>
            )}
            {resource.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor(resource.duration / 60)}h {resource.duration % 60}
                  m read
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: resource.content.replace(/\n/g, "<br>"),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blog Info */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Blog Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">Blog Post</span>
                </div>
                {resource.difficulty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="text-white capitalize">
                      {resource.difficulty}
                    </span>
                  </div>
                )}
                {resource.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reading Time</span>
                    <span className="text-white">
                      {Math.floor(resource.duration / 60)}h{" "}
                      {resource.duration % 60}m
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Published</span>
                  <span className="text-white">
                    {formatDate(resource.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Views</span>
                  <span className="text-white">{resource.views || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Actions */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/skills/blogs">
                    <FileText className="w-4 h-4 mr-2" />
                    Back to Blogs
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/skills/create-blog">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Blog
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
