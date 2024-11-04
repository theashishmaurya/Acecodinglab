/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    return config;
  },
  images: {
    domains: [
      'images.unsplash.com',
      'assets.aceternity.com',
      'aarnwlfhfqbipurwwkcz.supabase.co',
    ],
  },
};
const withMDX = require('@next/mdx')();

module.exports = withMDX(nextConfig);
