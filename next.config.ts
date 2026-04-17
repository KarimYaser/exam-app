import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "www.elevate-bootcamp.cloud",
      // },
      // {
      //   protocol: "https",
      //   hostname: "exam-app.elevate-bootcamp.cloud",
      // },
      // {
      //   protocol: "https",
      //   hostname: "elevate-bootcamp.cloud",
      // },
      new URL(`https://www.elevate-bootcamp.cloud/*/**`),
      new URL(`https://exam-app.elevate-bootcamp.cloud/*/**`),
      new URL(`https://elevate-bootcamp.cloud/*/**`),
    ],
  },
  experimental: {
    dynamicIO: true,
  } as any,
};

export default nextConfig;
