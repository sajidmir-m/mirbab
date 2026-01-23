
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/Chatbot";
import Snowfall from "@/components/ui/Snowfall";
import CornerDecorations from "@/components/ui/CornerDecorations";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mirbabatourandtravels.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mirbabatourandtravels.com',
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
        <GoogleAnalytics />
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ToastProvider>
          <Snowfall />
          {/* <CornerDecorations /> */}
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </ToastProvider>
      </body>
    </html>
  );
}
