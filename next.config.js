/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false, // ok while debugging hydration

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
    ],
  },

  async headers() {
    // ⬅️ In development, send NO headers so React can hydrate and clicks work
    if (isDev) return [];

    const common = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: "geolocation=(self), camera=(), microphone=(), payment=(self)" },
      { key: 'X-DNS-Prefetch-Control', value: 'off' },
    ];

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      // images used by maps/stripe/supabase
      "img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org https://api.mapbox.com https://maps.gstatic.com https://*.stripe.com",
      // allow inline styles (Tailwind) + mapbox styles
      "style-src 'self' 'unsafe-inline' https://unpkg.com https://api.mapbox.com",
      // NO 'unsafe-eval' in prod
      "script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net https://api.mapbox.com",
      // xhr/ws/fetch endpoints
      "connect-src 'self' https://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://*.stripe.com",
      // stripe iframes
      "frame-src 'self' https://js.stripe.com",
      // allow redirectToCheckout form posts
      "form-action 'self' https://checkout.stripe.com",
      // workers
      "worker-src 'self' blob:"
    ].join('; ');

    return [
      {
        // don’t apply to _next assets
        source: "/((?!_next/|favicon.ico|robots.txt|manifest.json).*)",
        headers: [...common, { key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

module.exports = nextConfig;

