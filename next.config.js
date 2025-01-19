/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["mangadex.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
        port: "",
        pathname: "/covers/**",
      },
      // Add other patterns if necessary
    ],
  },
};

export default config;
