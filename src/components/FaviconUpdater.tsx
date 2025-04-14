// src/components/FaviconUpdater.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function FaviconUpdater() {
  const { resolvedTheme } = useTheme(); // Use resolvedTheme to get 'light' or 'dark'
  const [mounted, setMounted] = useState(false);

  // Ensure we're running on the client
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) {
      return; // Don't run on server or before theme is resolved
    }

    // Determine the correct icon path
    const iconHref =
      resolvedTheme === "dark" ? "/logo_dark.png" : "/logo_light.png";

    // Find the favicon link element (we'll give it an ID in layout.tsx)
    const link = document.getElementById(
      "dynamic-favicon"
    ) as HTMLLinkElement | null;

    if (link && link.href !== iconHref) {
      link.href = iconHref;
    }
  }, [resolvedTheme, mounted]); // Re-run when theme or mount status changes

  // This component doesn't render anything visible
  return null;
}
