/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false, // Temporarily disable for debugging
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    const common = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: "geolocation=(self), camera=(), microphone=(), payment=(self)" },
      { key: 'X-DNS-Prefetch-Control', value: 'off' }
    ];

    // Low-risk CSP that keeps Mapbox/Leaflet/Stripe/Supabase working.
    // No HSTS here; Nginx will set it in prod only.
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org https://api.mapbox.com https://maps.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://unpkg.com https://api.mapbox.com",
      "script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net https://api.mapbox.com",
      "connect-src 'self' https://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://*.stripe.com",
      "frame-src 'self' https://js.stripe.com",
      "worker-src 'self' blob:"
    ].join('; ');

    const cspHeader = { key: 'Content-Security-Policy', value: csp };

    return [
      // App pages (avoid static asset paths)
      {
        source: '/((?!_next/|favicon.ico|robots.txt|manifest.json).*)',
        headers: [...common, cspHeader],
      },
    ];
  }
}

module.exports = nextConfig