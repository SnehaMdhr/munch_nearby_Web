import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

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
