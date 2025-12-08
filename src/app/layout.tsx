import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SplashLayout from "./splashLayout";
import Schema from "./schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://malaymishra.com"),
  title: "Malay Mishra - Fullstack Engineer | AdeptMind",
  description:
    "Malay Mishra - Fullstack Engineer with 4+ years of experience in Python, GO, React, Next.js, Node.js. Specialized in Micro Frontend, Performance Optimization, and Web Development at AdeptMind. Based in Bangalore, India.",
  keywords: [
    "Malay Mishra",
    "Malay",
    "AdeptMind",
    "Fullstack Engineer",
    "Fullstack Developer",
    "Malay Mishra Fullstack",
    "Python Developer",
    "React Developer",
    "Next.js Developer",
    "Micro Frontend",
    "Bangalore Developer",
    "Software Engineer India",
  ],
  authors: [{ name: "Malay Mishra" }],
  creator: "Malay Mishra",
  publisher: "Malay Mishra",
  alternates: {
    canonical: "https://malaymishra.com/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://malaymishra.com/",
    title: "Malay Mishra - Fullstack Engineer | AdeptMind",
    description:
      "Malay Mishra - Fullstack Engineer with 4+ years of experience in Python, GO, React, Next.js, Node.js. Specialized in Micro Frontend, Performance Optimization, and Web Development at AdeptMind.",
    siteName: "Malay Mishra Portfolio",
    images: [
      {
        url: "https://malaymishra.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Malay Mishra - Fullstack Engineer | AdeptMind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Malay Mishra - Fullstack Engineer | AdeptMind",
    description:
      "Fullstack Engineer with 4+ years of experience in Python, GO, React, Next.js, Node.js. Specialized in Micro Frontend and Performance Optimization.",
    images: ["https://malaymishra.com/og-image.png"],
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
      <head>
        <Schema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SplashLayout>{children}</SplashLayout>
      </body>
    </html>
  );
}
