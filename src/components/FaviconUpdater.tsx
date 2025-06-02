// src/components/FaviconUpdater.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function FaviconUpdater() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted || !resolvedTheme) {
      return;
    }

    const iconHref =
      resolvedTheme === "dark" ? "/logo_light.png" : "/logo_dark.png";

    let link = document.querySelector(
      "link[rel~='icon']"
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link") as HTMLLinkElement;
      link.rel = "icon";
      document.head.appendChild(link);
    }
    if (link.href !== iconHref) {
      link.href = iconHref;
      link.type = "image/png";
    }
  }, [resolvedTheme, mounted]);

  return null;
}
