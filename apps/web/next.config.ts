import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile the shared workspace package's TypeScript as part of this app.
  transpilePackages: ["@app/shared"],
};

export default nextConfig;
