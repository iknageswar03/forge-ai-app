import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  sw: "sw.js", // Explicitly name the service worker file
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  disable: false, // FORCE ENABLE it for this test (even in dev)
});

const nextConfig: NextConfig = {
  // Move turbopack here (Top Level)
  turbopack: {},

  reactStrictMode: true,
  // Your other options...
};

export default withPWA(nextConfig);
