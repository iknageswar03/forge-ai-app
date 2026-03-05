import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Forge – Train Smart. Grow Strong",
  description: "Forge is your AI-powered gym and workout planner designed to build real strength. Get personalized training plans, track progress, and push your limits with smart, data-driven workouts built just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar/>
          <div className="fixed inset-0 -z-1">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
            <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>
          <main className="pt-24 flex-grow">
            {children}
          </main>
          <Footer/>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
