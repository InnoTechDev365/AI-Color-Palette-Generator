/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/color-palette-generator' : '',
  trailingSlash: true,
};

export default nextConfig;
