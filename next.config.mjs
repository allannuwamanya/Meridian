/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Enable for Cloudflare Pages
    // This allows the app to work with the Pages Functions adapter
  },
};

export default nextConfig;
