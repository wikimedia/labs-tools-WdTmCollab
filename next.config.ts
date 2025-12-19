import type { NextConfig } from "next";
import BundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

let nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
    }
    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: false,
  },

  turbopack: {
    rules: {},
  },

  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    clientTraceMetadata: ["webpackChunkName"],
  },

  output: "standalone",
};

const WithBundleAnalyzer = BundleAnalyzer({
  enabled: true,
  openAnalyzer: false,
  analyzerMode: "static",
  logLevel: "info",
});

nextConfig = WithBundleAnalyzer(nextConfig);

export default withNextIntl(nextConfig);
