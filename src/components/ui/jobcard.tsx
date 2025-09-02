"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Heart,
  HeartOff,
  ExternalLink,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";

interface JobCardProps {
  job: {
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
      _id: string;
      firstName: string;
      lastName: string;
      company: string;
    };
  };
  onDelete?: (jobId: string) => void;
  onToggleSaved?: (jobId: string) => void;
  showActions?: boolean;
}

export default function JobCard({
  job,
  onDelete,
  onToggleSaved,
  showActions = true,
}: JobCardProps) {
  const { user, isLoaded } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = isLoaded && user?.id === job.employerId?._id;

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/jobs/${job._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete?.(job._id);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  const applyForJob = async () => {
    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: job._id }),
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

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{job.title}</h3>
              <Badge
                variant={job.type === "FULL_TIME" ? "default" : "secondary"}
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

            <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

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
            {onToggleSaved && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleSaved(job._id)}
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
            )}

            {showActions && isOwner && (
              <>
                <Link href={`/jobs/${job._id}/edit`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="border-red-400/40 text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}

            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={applyForJob}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
