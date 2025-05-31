// src/components/FaviconUpdater.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function FaviconUpdater() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted || !resolvedTheme) {
      return;
    }

    // --- INVERTED LOGIC ---
    // If theme is dark, use light logo. If theme is light, use dark logo.
    const iconHref =
      resolvedTheme === "dark" ? "/logo_light.png" : "/logo_dark.png";
    // --- END INVERTED LOGIC ---

    const link = document.getElementById(
      "dynamic-favicon"
    ) as HTMLLinkElement | null;

    if (link && link.href !== iconHref) {
      link.href = iconHref;
    }
  }, [resolvedTheme, mounted]);

  return null;
}
