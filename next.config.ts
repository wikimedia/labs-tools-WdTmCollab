import type { NextConfig } from "next";
import BundleAnalyzer from "@next/bundle-analyzer";

let nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
    }

    // Important: return the modified config
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
    rules: {
      // "*.lottie": ["@noxfed/lottie-webpack-loader"],
      // '*.svg': ['@svgr/webpack']
    },
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


// export default next
export default nextConfig;