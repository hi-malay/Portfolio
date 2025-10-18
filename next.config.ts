import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Portfolio",
  images: { unoptimized: true },
};

export default nextConfig;
