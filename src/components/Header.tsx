// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// REMOVED: import ThemeToggleButton from "./ThemeToggleButton";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const linkBaseStyle =
    "text-[20px] uppercase transition-colors duration-150 ease-in-out";

  return (
    <header
      className="
      fixed top-0 left-0 right-0 z-30 /* Highest z-index */
      w-full flex items-center justify-between
       md:justify-end
      px-3 py-2.5 h-11 md:h-16 md:p-5
      border border-black dark:border-white rounded-[1px]
      bg-white dark:bg-black
    "
    >
      {/* Mobile Section */}
      <div className="flex items-center gap-3 md:hidden">
        <Link href="/" className="block" aria-label="Homepage">
          <h2 className="text-xs font-medium uppercase tracking-widest">
            KINECTIC SOUTH | PRODUCTION
          </h2>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <nav>
          <ul className="flex items-center space-x-6">
            {/* WORK Link */}
            <li>
              <Link
                href="/"
                className={cn(
                  linkBaseStyle,
                  pathname === "/"
                    ? "font-semibold text-black dark:text-white"
                    : "font-normal text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                )}
              >
                Work
              </Link>
            </li>
            {/* CONTACT Link */}
            <li>
              <Link
                href="/contact"
                className={cn(
                  linkBaseStyle,
                  pathname === "/contact"
                    ? "font-semibold text-black dark:text-white"
                    : "font-normal text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                )}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
