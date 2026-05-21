import type { NextConfig } from "next";

const repo = "/FaceMesh2HPOWebApp/refs/heads/master";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  reactCompiler: true,
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
