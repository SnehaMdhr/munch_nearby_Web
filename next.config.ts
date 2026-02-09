import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // increase from default 1MB
    },
  },

  images:{
    dangerouslyAllowLocalIP: true,
    remotePatterns:[
      {
        protocol:"http",
        hostname:"localhost",
        pathname:"/api/uploads/**"
      },
      {
        protocol:"http",
        hostname:"localhost",
        port:"3000",
        pathname:"/uploads/**"
      },
      {
        protocol:"https",
        hostname:"unsplash.com"
      }
    ]
  }
};

export default nextConfig;
