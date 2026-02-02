
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { ToastProvider } from "@/components/ui/Toast";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import StructuredData from "./structured-data";
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
  title: "Mir Baba Tour and Travels - Kashmir | Best Tour Packages",
  description: "Experience the beauty of Kashmir with Mir Baba Tour and Travels. We offer customized tour packages, hotel bookings, and transport services in Srinagar, Gulmarg, Pahalgam, and more.",
  keywords: "Kashmir tour packages, Srinagar travel agency, Gulmarg tourism, Pahalgam hotels, Kashmir car rental",
  authors: [{ name: "Mir Baba Tour and Travels" }],
  creator: "Mir Baba Tour and Travels",
  publisher: "Mir Baba Tour and Travels",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mirbabatourtravels.in'),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mirbabatourtravels.in',
    siteName: 'Mir Baba Tour and Travels',
    title: 'Mir Baba Tour and Travels - Kashmir | Best Tour Packages',
    description: 'Experience the beauty of Kashmir with Mir Baba Tour and Travels.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mir Baba Tour and Travels - Kashmir',
    description: 'Experience the beauty of Kashmir with Mir Baba Tour and Travels.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <GoogleAnalytics />
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ToastProvider>
          <ConditionalLayout>
          {children}
          </ConditionalLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
