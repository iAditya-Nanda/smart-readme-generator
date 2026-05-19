import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://readmeforge.dev"),
  title: {
    default: "ReadmeForge | Professional Developer Documentation Platform",
    template: "%s | ReadmeForge",
  },
  description: "A production-grade, local-first documentation environment for creating premium GitHub READMEs with interactive IDE features, AI templates, and zero cloud dependency.",
  keywords: ["readme generator", "github", "documentation", "markdown editor", "developer tools", "local-first", "SaaS"],
  authors: [{ name: "ReadmeForge Team" }],
  creator: "ReadmeForge",
  publisher: "ReadmeForge Inc",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://readmeforge.dev",
    siteName: "ReadmeForge",
    title: "ReadmeForge | Professional Developer Documentation Platform",
    description: "A production-grade, local-first documentation environment for creating premium GitHub READMEs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReadmeForge Platform Interface Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadmeForge | Professional Developer Documentation",
    description: "A production-grade, local-first documentation environment for creating premium GitHub READMEs.",
    images: ["/og-image.png"],
    creator: "@readmeforge",
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#030303" },
    { media: "(prefers-color-scheme: dark)", color: "#030303" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
