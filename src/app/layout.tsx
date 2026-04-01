import type { Metadata, Viewport } from "next"; // Added Viewport type
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Move Viewport and Theme settings here
export const viewport: Viewport = {
  themeColor: "#18cef2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // This helps hide the URL bar & fill the screen
};

// 2. Keep Branding and PWA manifest here
export const metadata: Metadata = {
  title: "Forge – Train Smart. Grow Strong",
  description: "Forge is your AI-powered gym and workout planner designed to build real strength.",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Better for a "Native" look
    title: "Forge Fitness",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ConvexClerkProvider>
          <Navbar />
          <div className="fixed inset-0 -z-10"> {/* Fixed -z-1 to -z-10 for safety */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
            <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>
          <main className="pt-24 flex-grow">
            {children}
          </main>
          <Footer />
        </ConvexClerkProvider>
      </body>
    </html>
  );
}