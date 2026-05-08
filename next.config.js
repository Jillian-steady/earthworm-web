const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
