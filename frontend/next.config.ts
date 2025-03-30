import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    //remotePatterns: [
    //  {
    //    protocol: "https",
    //    hostname: "*",
    //    //hostname: "commons.wikimedia.org",
    //    //pathname: "/wiki/Special:Filepath/**",
    //  },
    //],
  },
};

export default nextConfig;
