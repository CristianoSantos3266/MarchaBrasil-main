import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ParticipantGrowthScheduler from "@/components/admin/ParticipantGrowthScheduler";
import RootErrorBoundary from "@/components/RootErrorBoundary";

export const metadata: Metadata = {
  title: "🇧🇷 Marcha Brasil - Manifestações Pacíficas",
  description: "Plataforma de coordenação para manifestações pacíficas e democráticas no Brasil",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Marcha Brasil'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#002776'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link rel="stylesheet" href="/css/hero-images.css" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <RootErrorBoundary>
          <AuthProvider>
            {children}
            <ParticipantGrowthScheduler enabled={true} intervalMinutes={60} />
          </AuthProvider>
        </RootErrorBoundary>
      </body>
    </html>
  );
}
