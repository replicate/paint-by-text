/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
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
