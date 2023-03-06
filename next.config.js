/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "replicate.com",
      "replicate.delivery",
      "user-images.githubusercontent.com",
    ],
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },  
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/replicate/paint-by-text",
        permanent: false,
      },
      {
        source: "/deploy",
        destination: "https://vercel.com/templates/next.js/paint-by-text",
        permanent: false,
      },   
    ]
  }
};

module.exports = nextConfig;
