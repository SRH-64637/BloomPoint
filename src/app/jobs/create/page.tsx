"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateJobPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    level: "BEGINNER",
    location: "",
    salary: "",
    type: "FULL_TIME",
    remote: false,
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the skills array
      const skillsArray = form.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Create the payload with actual form data
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        skillsRequired: skillsArray,
        level: form.level,
        location: form.location.trim(),
        salary: form.salary.trim(),
        type: form.type,
        remote: form.remote,
        company: form.company.trim(),
      };

      console.log("Sending payload:", payload);

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error(
          `Server returned invalid response: ${responseText.substring(0, 100)}`
        );
      }

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.details ||
            `Failed to create job: ${res.status} ${responseText}`
        );
      }

      alert("Job created successfully!");
      window.location.href = "/jobs";
    } catch (err: any) {
      console.error("Full error:", err);
      alert(`Error: ${err.message}\n\nCheck the browser console for details.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Create a new job</h1>
        <Link href="/jobs">
          <Button variant="outline" className="border-white/20">
            Back to jobs
          </Button>
        </Link>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Job details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Keep all your form fields exactly as they are */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Job title *
              </label>
              <input
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Company *
              </label>
              <input
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 min-h-40"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                placeholder="Enter job description"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Skills required (comma separated)
              </label>
              <input
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                value={form.skillsRequired}
                onChange={(e) =>
                  setForm({ ...form, skillsRequired: e.target.value })
                }
                placeholder="e.g., React, Node.js, JavaScript"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Level *
                </label>
                <select
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  required
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Type *
                </label>
                <select
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-6 md:mt-8">
                <input
                  id="remote"
                  type="checkbox"
                  checked={form.remote}
                  onChange={(e) =>
                    setForm({ ...form, remote: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="remote" className="text-gray-300 text-sm">
                  Remote
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Location
                </label>
                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="e.g., New York, NY"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Salary
                </label>
                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                {submitting ? "Creating..." : "Create job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
