import type { NextConfig } from "next";

const SVG_ISSUER_RE = /\.[jt]sx?$/;
const SVG_TEST_RE = /\.svg$/i;

const nextConfig: NextConfig = {
  // Stops Next from generating AGENTS.md / CLAUDE.md into the repo root.
  agentRules: false,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: ["@svgr/webpack"],
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      issuer: SVG_ISSUER_RE,
      test: SVG_TEST_RE,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
