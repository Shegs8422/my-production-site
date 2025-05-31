// src/components/ThemeProvider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes"; // Ensure correct type import

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  console.log("ThemeProvider rendered with theme:", props.defaultTheme);
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
