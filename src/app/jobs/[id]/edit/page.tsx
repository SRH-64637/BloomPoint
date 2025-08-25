"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const jobId = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const job = await res.json();
        if (!res.ok) throw new Error(job?.error || "Failed to load job");
        setForm({
          title: job.title || "",
          description: job.description || "",
          skillsRequired: (job.skillsRequired || []).join(", "),
          level: job.level || "BEGINNER",
          location: job.location || "",
          salary: job.salary || "",
          type: job.type || "FULL_TIME",
          remote: !!job.remote,
          company: job.company || "",
        });
      } catch (e) {
        alert((e as any).message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update job");
      router.push("/jobs");
    } catch (e) {
      alert((e as any).message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Edit job</h1>
        <Link href="/jobs">
          <Button variant="outline" className="border-white/20">
            Back
          </Button>
        </Link>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Job details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-300">Loading…</div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Job title
                </label>
                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Company
                </label>
                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white min-h-40"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  value={form.skillsRequired}
                  onChange={(e) =>
                    setForm({ ...form, skillsRequired: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Level
                  </label>
                  <select
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value })
                    }
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="FULL_TIME">FULL_TIME</option>
                    <option value="PART_TIME">PART_TIME</option>
                    <option value="CONTRACT">CONTRACT</option>
                    <option value="INTERNSHIP">INTERNSHIP</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-6 md:mt-8">
                  <input
                    id="remote"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={form.remote}
                    onChange={(e) =>
                      setForm({ ...form, remote: e.target.checked })
                    }
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
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Salary
                  </label>
                  <input
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    value={form.salary}
                    onChange={(e) =>
                      setForm({ ...form, salary: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
