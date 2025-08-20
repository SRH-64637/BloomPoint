"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  TrendingUp
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  tags: string[];
  saved: boolean;
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      posted: "2 days ago",
      description: "We're looking for a passionate frontend developer to join our team and help build amazing user experiences.",
      tags: ["React", "TypeScript", "Next.js", "Remote"],
      saved: false
    },
    {
      id: "2",
      title: "UX/UI Designer",
      company: "DesignStudio",
      location: "New York, NY",
      salary: "$90k - $120k",
      type: "Full-time",
      posted: "1 week ago",
      description: "Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.",
      tags: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
      saved: true
    },
    {
      id: "3",
      title: "Backend Engineer",
      company: "DataFlow",
      location: "Austin, TX",
      salary: "$100k - $130k",
      type: "Full-time",
      posted: "3 days ago",
      description: "Build scalable backend services and APIs that power our data-driven applications.",
      tags: ["Node.js", "Python", "AWS", "Database"],
      saved: false
    },
    {
      id: "4",
      title: "Product Manager",
      company: "InnovateLab",
      location: "Seattle, WA",
      salary: "$110k - $140k",
      type: "Full-time",
      posted: "5 days ago",
      description: "Lead product strategy and development for our innovative software solutions.",
      tags: ["Product Strategy", "Agile", "User Experience", "Analytics"],
      saved: false
    }
  ]);

  const allTags = Array.from(new Set(jobs.flatMap(job => job.tags)));

  const toggleSaved = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => job.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const savedJobs = jobs.filter(job => job.saved);

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Job Board</h1>
        <p className="text-gray-300 text-lg">Find your next opportunity</p>
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
                <div className="text-2xl font-bold text-white mb-2">{savedJobs.length}</div>
                <div className="text-sm text-gray-300">Jobs saved</div>
                {savedJobs.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    View Saved
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
              <Card key={job.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        <Badge variant={job.type === "Full-time" ? "default" : "secondary"}>
                          {job.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.posted}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-white/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaved(job.id)}
                        className={`p-2 ${
                          job.saved 
                            ? "text-red-400 hover:text-red-300" 
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {job.saved ? <Heart className="w-5 h-5 fill-current" /> : <HeartOff className="w-5 h-5" />}
                      </Button>
                      
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Quick Apply
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
                <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-gray-300">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
