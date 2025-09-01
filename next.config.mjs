/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["cloudinary"],
  },
  api: {
    bodyParser: {
      sizeLimit: "500mb", // Increased from default 1mb
    },
    responseLimit: "500mb",
  },
  serverRuntimeConfig: {
    maxFileSize: 500 * 1024 * 1024, // 500MB in bytes
  },
};

export default nextConfig;
