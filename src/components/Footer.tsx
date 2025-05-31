// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        fixed bottom-0 left-0 z-10
        flex items-center
        justify-start
        w-full h-11
        border-t border-l
        border-black dark:border-neutral-700
        bg-white dark:bg-black
        px-3 py-2.5
        md:hidden /* Still hides on medium screens and up */
      "
    >
      {/* Nav content remains the same */}
      <nav className="flex">
        {" "}
        {/* Removed md:hidden here as parent handles it */}
        <ul className="flex items-center space-x-6">
          <li>
            <Link
              href="/"
              className="font-sans text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white uppercase text-[20px] tracking-wider transition-colors"
            >
              WORK
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="font-sans text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white uppercase text-[20px] tracking-wider transition-colors"
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
