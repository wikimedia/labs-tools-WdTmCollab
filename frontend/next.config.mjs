/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      //{
      //  protocol: "https",
      //  hostname: "commons.wikimedia.org",
      //  pathname: "/wiki/Special:FilePath/**", // Allow any path under FilePath
      //},
      {
        protocol: "https",
        hostname: "*",
        pathname: "*",
      },
    ],
  },
};
export default nextConfig;
