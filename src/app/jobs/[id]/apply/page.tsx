"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApplyJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const jobId = params.id;
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // API currently expects JSON at /api/jobs/apply
      const res = await fetch(`/api/jobs/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, coverLetter }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "Failed to submit application");
      alert("Application submitted!");
      router.push("/jobs");
    } catch (err: any) {
      alert(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Apply to job</h1>
        <Link href="/jobs">
          <Button variant="outline" className="border-white/20">
            Back to jobs
          </Button>
        </Link>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Your application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Cover letter
              </label>
              <textarea
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 min-h-40"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Why are you a good fit?"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Resume (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="block w-full text-gray-300"
              />
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                {submitting ? "Submitting..." : "Submit application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
