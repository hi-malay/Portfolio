/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // for static export
  basePath: "/Portfolio",
  assetPrefix: "/Portfolio/",
  images: {
    unoptimized: true, // since GH Pages doesn't support Next Image optimization
  },
};

export default nextConfig;
