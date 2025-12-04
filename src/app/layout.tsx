import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SplashLayout from "./splashLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Malay Mishra - Fullstack Engineer",
  description:
    "Fullstack Engineer with 4+ years of experience in Python, GO, React, Next.js, Node.js. Specialized in Micro Frontend, Performance Optimization, and Web Development. Based in Bangalore.",
  alternates: {
    canonical: "https://portfolio-42g9.vercel.app/",
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
  verification: {
    google: "BsoJ5tRHh01SsjNToenPQW3Cl01ooNhS83KTXymqLeE",
  },

  icons: {
    icon: "/thumbnail_cropped.png",
    shortcut: "/thumbnail_cropped.png",
    apple: "/thumbnail_cropped.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SplashLayout>{children}</SplashLayout>
      </body>
    </html>
  );
}
