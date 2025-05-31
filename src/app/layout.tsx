// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import FaviconUpdater from "@/components/FaviconUpdater";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kinectic South | Production",
  description: "Portfolio for Kinectic, Production.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        {/* Static Favicon Links */}
        <link
          id="dynamic-favicon" // This is the link the server renders
          rel="icon"
          href="/logo_light.png" // The server will always use this initially
          type="image/png"
          sizes="66x64"
        />
      </head>

      <body className="bg-white dark:bg-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Header />
          <Sidebar />
          <div>{children}</div>
          <div className="hidden md:block fixed bottom-0 left-16 right-0 h-px bg-black dark:bg-neutral-700 z-20" />
          <Footer />
          <div
            className="fixed top-0 right-0 h-screen w-px bg-black dark:bg-white z-40"
            aria-hidden="true"
          />
          <div className="fixed bottom-4 right-4 z-40">
            <ThemeToggleButton />
          </div>
          <FaviconUpdater />
        </ThemeProvider>
      </body>
    </html>
  );
}
