import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Job } from "@/model/Job.models";

// POST: Bulk create jobs (non-protected)
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const jobsData = await request.json();
    
    // Validate that we received an array
    if (!Array.isArray(jobsData)) {
      return NextResponse.json(
        { error: "Request body must be an array of job objects" },
        { status: 400 }
      );
    }
    
    // Validate each job object
    const validatedJobs = [];
    const errors = [];
    
    for (let i = 0; i < jobsData.length; i++) {
      const job = jobsData[i];
      
      // Basic validation
      if (!job.title || !job.title.trim()) {
        errors.push(`Job at index ${i} is missing a title`);
        continue;
      }
      
      if (!job.description || !job.description.trim()) {
        errors.push(`Job at index ${i} is missing a description`);
        continue;
      }
      
      // Prepare job data with defaults
      const validatedJob = {
        title: job.title.trim(),
        description: job.description.trim(),
        skillsRequired: job.skillsRequired || [],
        level: job.level || "BEGINNER",
        location: job.location || "",
        salary: job.salary || "",
        type: job.type || "FULL_TIME",
        remote: job.remote || false,
        company: job.company || "",
        employerId: job.employerId || "bulk-import", // Default value for bulk imports
        createdAt: job.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      validatedJobs.push(validatedJob);
    }
    
    // If all jobs failed validation
    if (validatedJobs.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { 
          error: "All jobs failed validation", 
          details: errors 
        },
        { status: 400 }
      );
    }
    
    // Insert all validated jobs
    const result = await Job.insertMany(validatedJobs, { ordered: false });
    
    const response = {
      message: `Successfully created ${result.length} jobs`,
      createdCount: result.length,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined
    };
    
    return NextResponse.json(response, { status: 201 });
    
  } catch (error: any) {
    console.error("Bulk job creation error:", error);
    
    // Handle MongoDB bulk write errors
    if (error.name === 'BulkWriteError') {
      const writeErrors = error.writeErrors || [];
      const errorDetails = writeErrors.map((err: any) => ({
        index: err.index,
        error: err.errmsg
      }));
      
      return NextResponse.json(
        {
          error: "Partial bulk insert completed with errors",
          insertedCount: error.result?.insertedCount || 0,
          errorCount: writeErrors.length,
          errors: errorDetails
        },
        { status: 207 } // Multi-status
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to create jobs in bulk",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}