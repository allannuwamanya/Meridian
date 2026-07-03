import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f7f7f8",
};

export const metadata: Metadata = {
  title: {
    default: "Meridian – AI Career Intelligence",
    template: "%s | Meridian AI",
  },
  description: "The intelligent resume builder that rewrites, repositions, and critiques your professional narrative in real time.",
  keywords: ["resume builder", "AI resume", "career intelligence", "job application", "ATS optimization", "resume generator", "career tools"],
  authors: [{ name: "Meridian AI" }],
  creator: "Meridian AI",
  publisher: "Meridian AI",
  
  // Open Graph / Social Media
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meridian.yourdomain.com",
    siteName: "Meridian AI",
    title: "Meridian – AI Career Intelligence",
    description: "The intelligent resume builder that rewrites, repositions, and critiques your professional narrative in real time.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Meridian AI Resume Builder",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Meridian – AI Career Intelligence",
    description: "The intelligent resume builder that rewrites, repositions, and critiques your professional narrative in real time.",
    images: ["/api/og"],
    creator: "@MeridianAI",
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  
  // Manifest
  manifest: "/site.webmanifest",
  
  // App Links
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Meridian AI",
  },
  
  // PWA
  applicationName: "Meridian AI",
  category: "Business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
