/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['node-appwrite'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev',
        '*.github.dev',
        '*.githubpreview.dev'
      ]
    }
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      }, 
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '*',
      }, 
      {
        protocol: 'http',
        hostname: '**',
      }, 
    ]
  }
}

module.exports = nextConfig
