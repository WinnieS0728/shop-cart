/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "/t9sauqldw2t9najq/userAvatar/_public/*",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "/t9sauqldw2t9najq/productImage/_public/*",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/*",
      },
    ],
  },
};

module.exports = nextConfig;
