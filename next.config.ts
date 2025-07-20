import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/civic-mobilization' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/civic-mobilization/' : '',
};

export default nextConfig;
