// src/components/ThemeToggleButton.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";

// --- Icons (remain the same) ---
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" />
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
      clipRule="evenodd"
    />
  </svg>
);

// Default export
export default function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder to prevent layout shift, adjust size if needed
    return <div className="h-5 w-5 md:h-auto md:w-[60px]" aria-hidden="true" />;
  }

  const isCurrentlyDark = resolvedTheme === "dark";
  const toggleTheme = () => {
    console.log("Toggling theme");
    setTheme(isCurrentlyDark ? "light" : "dark");
  };

  return (
    <button
      aria-label={`Switch to ${isCurrentlyDark ? "light" : "dark"} mode`}
      type="button"
      onClick={toggleTheme}
      className="
        group                    /* Enable group-hover */
        flex items-center        /* Align icon and text */
        gap-2                    /* Space between icon and text when text visible */
        /* Add focus styles for accessibility if desired */
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
      "
    >
      {/* Text label */}
      <span
        className="
          hidden md:inline-block    /* Show only on desktop */
          text-sm uppercase tracking-wider font-normal
          text-neutral-700 dark:text-neutral-300
          /* --- MODIFIED: Opacity and Transition --- */
          md:opacity-0                /* Hidden by default on desktop */
          md:group-hover:opacity-100  /* Fade in on button hover */
          transition-opacity duration-1000 ease-in-out /* Animation */
        "
      >
        {isCurrentlyDark ? "Light" : "Dark"}
      </span>

      {/* Icon Container */}
      <div className="flex-shrink-0 text-black dark:text-white">
        {" "}
        {/* Ensure icon has color */}
        {isCurrentlyDark ? <SunIcon /> : <MoonIcon />}
      </div>
    </button>
  );
}
