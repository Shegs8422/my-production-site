// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ThemeToggleButton from "@/components/ThemeToggleButton"; // ADDED Import
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
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Header /> {/* z-30 */}
          <Sidebar /> {/* z-20 */}
          <div>{children}</div> {/* Renders page.tsx content */}
          <div className="hidden md:block fixed bottom-0 left-16 right-0 h-px bg-black dark:bg-neutral-700 z-20" />{" "}
          {/* Horizontal line */}
          <Footer /> {/* z-10 (mobile only) */}
          <div
            className="fixed top-0 right-0 h-screen w-px bg-black dark:bg-white z-40"
            aria-hidden="true"
          />{" "}
          {/* Right Edge Border */}
          {/* --- ADDED: Fixed Theme Toggle Button --- */}
          <div className="fixed bottom-4 right-4 z-40">
            {" "}
            {/* Positioning container */}
            <ThemeToggleButton />
          </div>
          {/* --- END: Fixed Theme Toggle Button --- */}
        </ThemeProvider>
      </body>
    </html>
  );
}
