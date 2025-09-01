"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Video,
  GraduationCap,
  Play,
  Plus,
  ArrowRight,
  ExternalLink,
  Upload,
  BookOpen,
} from "lucide-react";

const resourceTypes = [
  {
    id: "blog",
    title: "Blog Post",
    description: "Share your knowledge through written content",
    icon: FileText,
    color: "from-blue-500/20 to-cyan-500/20",
    features: [
      "Write detailed articles and tutorials",
      "Support for Markdown formatting",
      "Easy to read and share",
      "Great for step-by-step guides",
    ],
    route: "/skills/create-blog",
  },
  {
    id: "video",
    title: "Video Resource",
    description: "Create engaging video content",
    icon: Video,
    color: "from-purple-500/20 to-pink-500/20",
    features: [
      "Upload video files (up to 100MB)",
      "Embed YouTube or Vimeo videos",
      "Support for custom embed codes",
      "Perfect for demonstrations and tutorials",
    ],
    route: "/skills/create-video",
  },
  {
    id: "course",
    title: "Course Resource",
    description: "Share external courses and learning paths",
    icon: GraduationCap,
    color: "from-green-500/20 to-emerald-500/20",
    features: [
      "Link to external course platforms",
      "Coursera, Udemy, edX, and more",
      "Add your own descriptions and tags",
      "Curate the best learning resources",
    ],
    route: "/skills/create-course",
  },
  {
    id: "multi-video",
    title: "Multi-Video Course",
    description: "Create comprehensive video courses with multiple lectures",
    icon: Play,
    color: "from-orange-500/20 to-red-500/20",
    features: [
      "Multiple video lectures in one course",
      "Upload or embed videos for each lecture",
      "Progress tracking and completion",
      "Perfect for comprehensive tutorials",
    ],
    route: "/skills/create-multi-video",
  },
];

export default function CreateResourcePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleCreate = () => {
    if (selectedType) {
      const resource = resourceTypes.find((r) => r.id === selectedType);
      if (resource) {
        router.push(resource.route);
      }
    }
  };

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Plus className="w-10 h-10 text-emerald-400" />
            Create Resource
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the type of resource you want to create and share with the
            community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {resourceTypes.map((resource) => {
            const IconComponent = resource.icon;
            const isSelected = selectedType === resource.id;

            return (
              <Card
                key={resource.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-white/10 bg-black/20 hover:border-white/30 hover:bg-black/30"
                }`}
                onClick={() => handleSelect(resource.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${resource.color}`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl">
                        {resource.title}
                      </CardTitle>
                      <p className="text-gray-400 text-sm mt-1">
                        {resource.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resource.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedType && (
          <div className="text-center">
            <Button
              onClick={handleCreate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Create {resourceTypes.find((r) => r.id === selectedType)?.title}
            </Button>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Tips for Creating Great Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-white/10 bg-black/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-semibold text-white">
                    Be Clear & Concise
                  </h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Use clear titles and descriptions. Make sure your content is
                  easy to understand and follow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Upload className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-semibold text-white">Quality Content</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Focus on providing value. Share knowledge that others can
                  actually use and benefit from.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ExternalLink className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-semibold text-white">Use Tags Wisely</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Add relevant tags to help others discover your content. Think
                  about what someone would search for.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}




