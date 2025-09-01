import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// File validation utilities
export const FILE_SIZE_LIMITS = {
  VIDEO: 500 * 1024 * 1024, // 500MB
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
} as const;

export const SUPPORTED_VIDEO_FORMATS = [
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/webm",
  "video/mkv",
  "video/flv",
] as const;

export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

export function validateFileType(
  file: File,
  allowedTypes: readonly string[]
): boolean {
  return allowedTypes.includes(file.type);
}

export function getFileValidationError(
  file: File,
  maxSize: number,
  allowedTypes: readonly string[]
): string | null {
  if (!validateFileSize(file, maxSize)) {
    return `File size too large. Maximum size is ${formatFileSize(maxSize)}.`;
  }

  if (!validateFileType(file, allowedTypes)) {
    return `Unsupported file type. Allowed types: ${allowedTypes
      .map((t) => t.split("/")[1].toUpperCase())
      .join(", ")}.`;
  }

  return null;
}
