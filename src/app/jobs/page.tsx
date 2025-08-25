"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Heart,
  HeartOff,
  Filter,
  Search,
  Bookmark,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  type?: string;
  createdAt: string;
  description: string;
  skillsRequired: string[];
  level: string;
  remote?: boolean;
  saved?: boolean;
  employerId?: {
    firstName: string;
    lastName: string;
    company: string;
  };
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append("search", searchTerm);
        if (selectedTags.length > 0)
          queryParams.append("skills", selectedTags.join(","));

        const response = await fetch(`/api/jobs?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(
          data.map((job: any) => ({
            ...job,
            saved: false,
            company:
              job.employerId?.company || job.company || "Unknown Company",
            posted: formatDate(job.createdAt),
          }))
        );
      } catch (err) {
        setError("Failed to load jobs");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, selectedTags]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const allTags = Array.from(
    new Set(jobs.flatMap((job) => job.skillsRequired))
  );

  const toggleSaved = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job._id === jobId ? { ...job, saved: !job.saved } : job
      )
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const applyForJob = async (jobId: string) => {
    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to apply for job");
      }
    } catch (err) {
      alert("Failed to apply for job");
      console.error("Error applying for job:", err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => job.skillsRequired.includes(tag));

    return matchesSearch && matchesTags;
  });

  const savedJobs = jobs.filter((job) => job.saved);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="text-center">
          <p className="text-white">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <div className="mb-12 flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-white mb-1">Job Board</h1>
          <p className="text-gray-300 text-lg">Find your next opportunity</p>
        </div>
        <Link href="/jobs/create" className="inline-block">
          <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
            + Create new job
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters and Search */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Search className="w-5 h-5 text-blue-400" />
                Search Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs, companies..."
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </CardContent>
          </Card>

          {/* Filter Tags */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Filter className="w-5 h-5 text-purple-400" />
                Filter by Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allTags.map((tag) => (
                <Button
                  type="button"
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className={`w-full justify-start ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-white/20 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </Button>
              ))}
              {selectedTags.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Saved Jobs */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bookmark className="w-5 h-5 text-yellow-400" />
                Saved Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {savedJobs.length}
                </div>
                <div className="text-sm text-gray-300">Jobs saved</div>
                {savedJobs.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                    onClick={() => {
                      setJobs((prev) =>
                        prev.map((job) => ({ ...job, saved: false }))
                      );
                      setSelectedTags([]);
                    }}
                  >
                    Clear Saved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {filteredJobs.length} Jobs Found
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <TrendingUp className="w-4 h-4" />
              <span>New jobs posted daily</span>
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {job.title}
                        </h3>
                        <Badge
                          variant={
                            job.type === "FULL_TIME" ? "default" : "secondary"
                          }
                        >
                          {job.type?.replace("_", " ")}
                        </Badge>
                        {job.remote && (
                          <Badge
                            variant="outline"
                            className="border-green-400 text-green-400"
                          >
                            Remote
                          </Badge>
                        )}
                        {job.level && (
                          <Badge
                            variant="outline"
                            className="border-blue-400 text-blue-400"
                          >
                            {job.level}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.company}
                        </div>
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(job.createdAt)}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skillsRequired.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-white/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaved(job._id)}
                        className={`p-2 ${
                          job.saved
                            ? "text-red-400 hover:text-red-300"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {job.saved ? (
                          <Heart className="w-5 h-5 fill-current" />
                        ) : (
                          <HeartOff className="w-5 h-5" />
                        )}
                      </Button>

                      <Link href={`/jobs/${job._id}/edit`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20"
                        >
                          Edit
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-400/40 text-red-300 hover:bg-red-500/20"
                        onClick={async () => {
                          if (!confirm("Delete this job?")) return;
                          try {
                            const res = await fetch(`/api/jobs/${job._id}`, {
                              method: "DELETE",
                            });
                            if (res.ok) {
                              setJobs((prev) =>
                                prev.filter((j) => j._id !== job._id)
                              );
                            } else {
                              const e = await res.json();
                              alert(e.error || "Failed to delete job");
                            }
                          } catch (e) {
                            console.error(e);
                            alert("Failed to delete job");
                          }
                        }}
                      >
                        Delete
                      </Button>

                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => applyForJob(job._id)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-300">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
