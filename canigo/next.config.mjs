/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  output: 'standalone',
  turbopack: { root: process.cwd() },
};

export default nextConfig;
