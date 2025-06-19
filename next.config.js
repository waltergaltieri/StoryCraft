/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'aimlapi.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig 