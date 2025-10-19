/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only use static export for Capacitor builds, not for Vercel
  ...(process.env.BUILD_FOR_CAPACITOR === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  })
}

module.exports = nextConfig

