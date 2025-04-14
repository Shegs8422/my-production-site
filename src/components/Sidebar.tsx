// src/components/Sidebar.tsx
export default function Sidebar() {
  return (
    <aside
      className={`
        hidden md:flex
        fixed left-0 top-0
        w-16
        h-screen
        /* --- MODIFIED BORDERS --- */
        border-l border-r border-b /* Add left and bottom borders */
        border-black                 /* Light mode border color (#000) */
        dark:border-white            /* Dark mode border color (#fff) */
        /* --- Translucency/Blur --- */
        bg-white/10 dark:bg-black/30
        backdrop-blur-lg
        /* --- Positioning/Stacking --- */
        z-20 /* Keep z-index */
        items-center justify-center
      `}
    >
      {/* Vertical Text Div */}
      <div className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-sm md:text-[20px] tracking-wider">
        <span className="text-black dark:text-white font-medium opacity-80 dark:opacity-70">
          Kinetic South
        </span>
        <span className="text-neutral-500 dark:text-neutral-500 mx-1 opacity-60">
          |
        </span>
        <span className="text-black dark:text-white font-medium opacity-80 dark:opacity-70">
          Production
        </span>
      </div>
    </aside>
  );
}
