"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Compass,
  BookOpen,
  MessageSquare,
  Heart,
  Star,
  Sparkles,
  Monitor,
  TrendingUp,
  Clock,
  Target,
  GraduationCap,
  FileText,
  Lightbulb,
  Users,
  Plus,
} from "lucide-react";

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
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration?: number; // in minutes
  progress?: number; // 0-100
};

type GuidedAnswers = {
  focusArea: string;
  timeAvailable: number;
  contentStyle: string;
  level: string;
  mode: string;
};

const FOCUS_AREAS = [
  "Programming",
  "Design",
  "Communication",
  "Well-Being",
  "Leadership",
  "Creativity",
  "Technology",
  "Personal Growth",
];

const TIME_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2+ hours" },
];

const CONTENT_STYLES = [
  "Visual & Interactive",
  "Reading & Writing",
  "Audio & Video",
  "Hands-on Practice",
];

const LEVELS = [
  "Complete Beginner",
  "Some Experience",
  "Intermediate",
  "Advanced",
];

const MODES = ["Calm Focus", "Free Exploration"];

const CATEGORIES = [
  {
    name: "Programming",
    icon: Monitor,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "Design",
    icon: Sparkles,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    name: "Communication",
    icon: MessageSquare,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Well-Being",
    icon: Heart,
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    name: "Leadership",
    icon: Star,
    color: "from-indigo-500/20 to-blue-500/20",
  },
  {
    name: "Creativity",
    icon: Sparkles,
    color: "from-pink-500/20 to-rose-500/20",
  },
];

export default function SkillsDashboard() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showGuidedMode, setShowGuidedMode] = useState<boolean>(false);
  const [guidedStep, setGuidedStep] = useState<number>(0);
  const [guidedAnswers, setGuidedAnswers] = useState<GuidedAnswers>({
    focusArea: "",
    timeAvailable: 0,
    contentStyle: "",
    level: "",
    mode: "",
  });
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (
      guidedAnswers.focusArea &&
      guidedAnswers.timeAvailable &&
      guidedAnswers.contentStyle &&
      guidedAnswers.level &&
      guidedAnswers.mode
    ) {
      applyGuidedFilters();
    }
  }, [guidedAnswers]);

  async function fetchResources() {
    setLoading(true);
    try {
      const res = await fetch("/api/resources", { cache: "no-store" });
      const data = await res.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  }

  function applyGuidedFilters() {
    let filtered = resources;

    // Filter by focus area
    if (guidedAnswers.focusArea) {
      filtered = filtered.filter((r) =>
        r.tags.some((tag) =>
          tag.toLowerCase().includes(guidedAnswers.focusArea.toLowerCase())
        )
      );
    }

    // Filter by time available
    if (guidedAnswers.timeAvailable) {
      filtered = filtered.filter(
        (r) => !r.duration || r.duration <= guidedAnswers.timeAvailable
      );
    }

    // Filter by level
    if (guidedAnswers.level === "Complete Beginner") {
      filtered = filtered.filter((r) => r.difficulty === "beginner");
    } else if (guidedAnswers.level === "Advanced") {
      filtered = filtered.filter((r) => r.difficulty === "advanced");
    }

    setFilteredResources(filtered.slice(0, 6)); // Show top 6 matches
  }

  function handleGuidedAnswer(answer: Partial<GuidedAnswers>) {
    setGuidedAnswers((prev) => ({ ...prev, ...answer }));
    if (guidedStep < 4) {
      setGuidedStep((prev) => prev + 1);
    }
  }

  function resetGuidedMode() {
    setShowGuidedMode(false);
    setGuidedStep(0);
    setGuidedAnswers({
      focusArea: "",
      timeAvailable: 0,
      contentStyle: "",
      level: "",
      mode: "",
    });
    setFilteredResources([]);
  }

  const courses = useMemo(
    () =>
      resources.filter(
        (r) => r.type === "course" || r.type === "multi-video-course"
      ),
    [resources]
  );
  const blogs = useMemo(
    () =>
      resources.filter((r) => r.type === "blog" && !r.tags?.includes("thread")),
    [resources]
  );
  const videos = useMemo(
    () => resources.filter((r) => r.type === "video"),
    [resources]
  );

  const guidedQuestions = [
    {
      question: "Pick what excites you right now.",
      options: FOCUS_AREAS,
      key: "focusArea",
    },
    {
      question: "How much time do you want to spend today?",
      options: TIME_OPTIONS.map((t) => t.label),
      key: "timeAvailable",
    },
    {
      question: "Which format feels easiest for you?",
      options: CONTENT_STYLES,
      key: "contentStyle",
    },
    {
      question: "Where do you see yourself starting?",
      options: LEVELS,
      key: "level",
    },
    {
      question: "Do you want calm focus or free exploration?",
      options: MODES,
      key: "mode",
    },
  ];

  return (
    <main className="min-h-screen p-6 pt-24">
      {/* Header Section */}
      <div className="mx-auto mb-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            What do you feel like learning today?
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Let's find the perfect learning path for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowGuidedMode(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              <Compass className="w-5 h-5 mr-2" />
              Start Guided Mode
            </Button>
            <Link href="/skills/create">
              <Button
                variant="outline"
                className="btn-outline text-lg px-8 py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Resource
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Guided Mode Modal */}
      {showGuidedMode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Let's Find Your Path</h2>
              <Progress value={(guidedStep / 4) * 100} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Step {guidedStep + 1} of 5
              </p>
            </div>

            {guidedStep < 5 ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">
                  {guidedQuestions[guidedStep].question}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {guidedQuestions[guidedStep].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => {
                        const key = guidedQuestions[guidedStep]
                          .key as keyof GuidedAnswers;
                        const value =
                          key === "timeAvailable"
                            ? TIME_OPTIONS[index].value
                            : option;
                        handleGuidedAnswer({ [key]: value });
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-primary">
                  Perfect! Here's Your Path
                </h3>
                <div className="space-y-3 text-left bg-muted/20 p-4 rounded-lg">
                  <p>
                    <strong>Focus:</strong> {guidedAnswers.focusArea}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {
                      TIME_OPTIONS.find(
                        (t) => t.value === guidedAnswers.timeAvailable
                      )?.label
                    }
                  </p>
                  <p>
                    <strong>Style:</strong> {guidedAnswers.contentStyle}
                  </p>
                  <p>
                    <strong>Level:</strong> {guidedAnswers.level}
                  </p>
                  <p>
                    <strong>Mode:</strong> {guidedAnswers.mode}
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={resetGuidedMode} variant="outline">
                    Start Over
                  </Button>
                  <Button
                    onClick={() => setShowGuidedMode(false)}
                    className="btn-primary"
                  >
                    Explore Results
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guided Results */}
      {filteredResources.length > 0 && (
        <section className="mx-auto mb-12 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="w-6 h-6" />
              Recommended for You
            </h2>
            <Button variant="outline" onClick={resetGuidedMode}>
              Clear Filters
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Link
                key={resource._id}
                href={`/skills/${
                  resource.type === "multi-video-course"
                    ? "courses"
                    : resource.type
                }s/${resource._id}`}
                className="group"
              >
                <Card className="overflow-hidden border-white/10 bg-black/20 hover:bg-black/30 transition-all duration-300">
                  <div className="relative h-40 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                      <h3 className="text-lg font-semibold">
                        {resource.title}
                      </h3>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-sm text-white/90">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex flex-wrap gap-2">
                      {resource.tags?.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      {resource.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {resource.difficulty}
                        </Badge>
                      )}
                      {resource.duration && (
                        <span>
                          {Math.floor(resource.duration / 60)}h{" "}
                          {resource.duration % 60}m
                        </span>
                      )}
                    </div>
                    {resource.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{resource.progress}%</span>
                        </div>
                        <Progress value={resource.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto mb-12 max-w-6xl">
        <h2 className="mb-6 text-2xl font-semibold">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? "" : category.name
                  )
                }
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/20"
                }`}
              >
                <div className="flex justify-center mb-2">
                  <IconComponent className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium">{category.name}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Continue Where You Left Off */}
      <section className="mx-auto mb-12 max-w-6xl">
        <h2 className="mb-6 text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Continue Where You Left Off
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses
            .filter((c) => c.progress && c.progress > 0)
            .slice(0, 3)
            .map((course) => (
              <Link
                key={course._id}
                href={`/skills/courses/${course._id}`}
                className="group"
              >
                <Card className="overflow-hidden border-white/10 bg-black/20">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex flex-wrap gap-2">
                      {course.tags?.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>

      {/* Main Content - Courses */}
      <section className="mx-auto mb-12 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Courses
          </h2>
          <div className="flex gap-2">
            <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm focus:border-white/30 text-white">
              <option value="" className="bg-black text-white">
                All Levels
              </option>
              <option value="beginner" className="bg-black text-white">
                Beginner
              </option>
              <option value="intermediate" className="bg-black text-white">
                Intermediate
              </option>
              <option value="advanced" className="bg-black text-white">
                Advanced
              </option>
            </select>
            <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm focus:border-white/30 text-white">
              <option value="" className="bg-black text-white">
                All Durations
              </option>
              <option value="short" className="bg-black text-white">
                Under 30 min
              </option>
              <option value="medium" className="bg-black text-white">
                30-60 min
              </option>
              <option value="long" className="bg-black text-white">
                Over 1 hour
              </option>
            </select>
          </div>
        </div>
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((c) => (
            <Link
              key={c._id}
              href={`/skills/courses/${c._id}`}
              className="group"
            >
              <Card className="overflow-hidden border-white/10 bg-black/20 hover:bg-black/30 transition-all duration-300">
                <div className="relative h-40 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm text-white/90">{c.description}</p>
                  </div>
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap gap-2">
                    {c.tags?.slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  {c.difficulty && (
                    <Badge variant="outline" className="text-xs">
                      {c.difficulty}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {courses.length > 6 && (
          <div className="text-center mt-6">
            <Link href="/skills/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Main Content - Blogs */}
      <section className="mx-auto mb-12 max-w-6xl">
        <h2 className="mb-6 text-2xl font-semibold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Blogs & Articles
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.slice(0, 6).map((b) => (
            <Link key={b._id} href={`/skills/blogs/${b._id}`} className="group">
              <Card className="overflow-hidden border-white/10 bg-black/20 hover:bg-black/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{b.title}</CardTitle>
                </CardHeader>
                <CardContent className="-mt-2 space-y-2 p-4 pt-0">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {b.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {b.tags?.slice(0, 4).map((tg) => (
                      <Badge key={tg} variant="secondary">
                        {tg}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {blogs.length > 6 && (
          <div className="text-center mt-6">
            <Link href="/skills/blogs">
              <Button variant="outline">View All Blogs</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Support & Community */}
      <section className="mx-auto mb-12 max-w-6xl">
        <h2 className="mb-6 text-2xl font-semibold flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Learning Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-white/10 bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Tips for Focus & Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Special guidance for neurodiverse learners and anyone who wants
                to optimize their learning experience.
              </p>
              <Button variant="outline" className="w-full">
                Explore Tips
              </Button>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Quiet Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join thoughtful discussions and share your learning journey in a
                calm, supportive environment.
              </p>
              <Button variant="outline" className="w-full">
                Join Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
