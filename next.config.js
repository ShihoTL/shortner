/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NETLIFY ? "export" : undefined,
  trailingSlash: true,
  images: { 
    unoptimized: true,
    domains: ['lh3.googleusercontent.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: false
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
