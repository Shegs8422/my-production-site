// src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { client, urlFor } from "@/lib/sanityclient";
import type { SanityProject, CreditItem } from "@/lib/types";
import Lenis from "lenis";

// --- Constants ---
const DETAILS_PANEL_INITIAL_HEIGHT_MOBILE_PX = 200;
const DETAILS_PANEL_INITIAL_HEIGHT_DESKTOP_PX = 180;
const DETAILS_PANEL_HEIGHT_MOBILE_CLASS = `h-[${DETAILS_PANEL_INITIAL_HEIGHT_MOBILE_PX}px]`;
const DETAILS_PANEL_HEIGHT_DESKTOP_CLASS = `h-[${DETAILS_PANEL_INITIAL_HEIGHT_DESKTOP_PX}px]`;
const GRID_TRANSLATE_Y_MOBILE_PX = -DETAILS_PANEL_INITIAL_HEIGHT_MOBILE_PX;
const GRID_TRANSLATE_Y_DESKTOP_PX = -DETAILS_PANEL_INITIAL_HEIGHT_DESKTOP_PX;

export default function Home() {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [fetchedProjects, setFetchedProjects] = useState<SanityProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gridTranslateY, setGridTranslateY] = useState(0);
  const [initialDetailsTranslateY, setInitialDetailsTranslateY] =
    useState("100%");

  // --- Fetch Data Effect ---
  useEffect(() => {
    setIsClient(true);
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const query = `*[_type == "project"] | order(orderRank asc, _createdAt desc) {
          _id, title, slug, client, director, mainImage { asset, alt }, externalLink, visitLink,
          credits[]{ _key, role, name }, productionCo, serviceProduction, producer
        }`;
        const data = await client.fetch<SanityProject[]>(query);
        setFetchedProjects(data || []);
      } catch (error) {
        console.error("Failed to fetch Sanity projects:", error);
        setFetchedProjects([]);
      } finally {
        // Simulate loading time if needed for testing spinner:
        // await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Find selected project data
  const selectedProjectData = selectedProjectId
    ? fetchedProjects.find((p) => p._id === selectedProjectId)
    : null;

  // --- Lenis initialization effect ---
  useEffect(() => {
    if (isLoading || !isClient || !scrollWrapperRef.current) return;
    const contentElement =
      scrollWrapperRef.current.querySelector<HTMLElement>(":scope > div");
    if (!scrollWrapperRef.current || !contentElement) return;
    const lenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: contentElement,
      orientation: "horizontal",
      gestureOrientation: "both",
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    const handleResize = () => lenis.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoading, isClient]);

  // --- Toggle/Close/Expand/Collapse Handlers ---
  const handleToggleDetails = (projectId: string) => {
    setSelectedProjectId((prevId) => {
      const nextId = prevId === projectId ? null : projectId;
      if (nextId === null || nextId !== prevId) setIsExpanded(false);
      return nextId;
    });
  };
  const handleCloseDetails = () => {
    setSelectedProjectId(null);
    setIsExpanded(false);
  };
  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => setIsExpanded(false);

  // --- Calculate TranslateY for Grid State ---
  useEffect(() => {
    if (!isClient) return;
    const calculateTranslate = () => {
      let translateY = 0;
      if (selectedProjectId) {
        const isDesktop = window.innerWidth >= 768;
        if (isExpanded) {
          const header = document.querySelector("header");
          const footer = document.querySelector("footer");
          const headerHeight = header?.offsetHeight ?? (isDesktop ? 64 : 44);
          const footerHeight = !isDesktop ? (footer?.offsetHeight ?? 44) : 0;
          const availableHeight =
            window.innerHeight - headerHeight - footerHeight;
          translateY = -availableHeight;
        } else {
          translateY = isDesktop
            ? GRID_TRANSLATE_Y_DESKTOP_PX
            : GRID_TRANSLATE_Y_MOBILE_PX;
        }
      }
      setGridTranslateY(translateY);
    };
    calculateTranslate();
    window.addEventListener("resize", calculateTranslate);
    return () => window.removeEventListener("resize", calculateTranslate);
  }, [selectedProjectId, isExpanded, isClient]);

  // --- Calculate TranslateY State for Initial Details Panel ---
  useEffect(() => {
    if (selectedProjectId && !isExpanded) setInitialDetailsTranslateY("0%");
    else if (selectedProjectId && isExpanded)
      setInitialDetailsTranslateY("-100%");
    else setInitialDetailsTranslateY("100%");
  }, [selectedProjectId, isExpanded]);

  // --- Loading State ---
  if (isLoading) {
    return (
      // Full screen container with background colors
      <div className="flex items-center justify-center h-screen w-screen bg-white dark:bg-black">
        {/* Spinner Element */}
        <div
          className="
            w-12 h-12 /* Size of the spinner */
            rounded-full /* Make it a circle */
            border-4 border-solid
            border-neutral-200 dark:border-neutral-700
            border-t-black dark:border-t-white 
            animate-spin
          "
          role="status" // Accessibility role
          aria-label="Loading projects" // Accessibility label
        ></div>
      </div>
    );
  }

  // --- RETURN JSX ---
  return (
    <main className="relative w-full h-screen overflow-hidden bg-white dark:bg-black">
      {/* Scrollable Project Grid Section - FIXED (z-10, transparent bg) */}
      <section
        ref={scrollWrapperRef}
        className={cn(
          `fixed z-10 top-11 md:top-16 left-0 right-0 bottom-11 md:bottom-0
           overflow-y-hidden scrollbar-hide
           transition-transform duration-500 ease-in-out`, // NO background class
          selectedProjectId && !isExpanded
            ? "border-b border-black dark:border-neutral-700"
            : "border-b-0"
        )}
        style={{ transform: `translateY(${gridTranslateY}px)` }}
      >
        {/* Inner Wrapper - Lenis content */}
        <div
          className={cn(
            "flex w-max",
            !selectedProjectId ? "h-full items-center" : "h-auto items-start"
          )}
        >
          {/* Project List UL (Padding accounts for sidebar) */}
          <ul
            className={cn(
              `flex items-start h-auto w-max list-none gap-8 md:gap-10 xl:gap-12`,
              `px-3 md:pl-24 md:pr-8`,
              !selectedProjectId ? "py-8 md:py-12" : "py-8"
            )}
          >
            {/* Map FETECHED Projects */}
            {fetchedProjects.map((project, index) => (
              <li
                key={project._id}
                id={`project-${project._id}`}
                className={cn(
                  `flex flex-col flex-shrink-0
                   w-[calc(100vw-1.5rem)] sm:w-[48vw] md:w-[40vw] lg:w-[365px] xl:w-[365px]
                   lg:min-w-0
                   transition-opacity duration-500 ease-in-out`,
                  (selectedProjectId && selectedProjectId !== project._id) ||
                    (selectedProjectId === project._id && isExpanded)
                    ? "opacity-30 pointer-events-none"
                    : "opacity-100"
                )}
              >
                {/* Card Content */}
                <div className="flex relative flex-col items-start w-full">
                  {/* Image Link & Overlays */}
                  <Link
                    href={project.externalLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mb-4 group cursor-pointer"
                    draggable="false"
                  >
                    {/* Image Container - Fixed size lg+, aspect-video smaller, no rounded corners */}
                    <div className="relative w-full h-auto aspect-video lg:w-[365px] lg:h-[262px] lg:aspect-auto overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      {project.mainImage?.asset ? (
                        <Image
                          src={urlFor(project.mainImage.asset)
                            .width(730)
                            .quality(85)
                            .auto("format")
                            .url()}
                          alt={
                            project.mainImage.alt ||
                            project.title ||
                            "Project image"
                          }
                          width={365}
                          height={262}
                          sizes="(max-width: 1023px) 48vw, 365px"
                          className="object-cover w-full h-full transition transform duration-500 ease-in-out group-hover:scale-105"
                          priority={index < 3}
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 text-sm">
                          Image Unavailable
                        </div>
                      )}
                      {/* Overlays - no rounded corners */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-[777ms] ease-in-out" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-[777ms] ease-in-out delay-[100ms] text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 32 32"
                          fill="none"
                          className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-all duration-[333ms] ease-in group-hover:scale-95"
                          aria-hidden="true"
                        >
                          <path
                            fill="currentColor"
                            d="M27.355 28.947V12.696h3.04V32H0V1.472h19.22v3.053H3.04v24.422h24.315Zm-.544-25.894h-4.037V0H32v9.267h-3.04V5.21L14.806 19.428l-2.149-2.159L26.811 3.053Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                  {/* Text Content Below Image */}
                  <div className="w-full px-1">
                    <h3 className="text-xl md:text-[22px] mb-3 font-medium text-black dark:text-white truncate">
                      {project.title || "Untitled Project"}
                    </h3>
                    <div className="flex items-start justify-between w-full mb-4 text-xs md:text-sm">
                      <div>
                        <p className="text-xs uppercase text-neutral-600 dark:text-neutral-500 mb-1 tracking-wider">
                          Client
                        </p>
                        <p className="text-sm md:text-base text-black dark:text-neutral-200 truncate">
                          {project.client || "-"}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs uppercase text-neutral-600 dark:text-neutral-500 mb-1 tracking-wider">
                          Director
                        </p>
                        <p className="text-sm md:text-base text-black dark:text-neutral-200 truncate">
                          {project.director || "-"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-neutral-600 dark:text-neutral-500 mb-1 tracking-wider">
                        Further info
                      </p>
                      <button
                        onClick={() => handleToggleDetails(project._id)}
                        className="group/button flex items-center text-sm md:text-base text-black dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                      >
                        {selectedProjectId === project._id ? "Hide" : "Show"}
                        {selectedProjectId === project._id ? (
                          <svg
                            className="ml-1 w-3 h-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 10 6"
                            aria-hidden="true"
                          >
                            {" "}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="m1 1 4 4 4-4"
                            />{" "}
                          </svg>
                        ) : (
                          <svg
                            className="ml-1 w-3 h-3 flex-shrink-0 transition-transform duration-300 group-hover/button:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 10 10"
                            aria-hidden="true"
                          >
                            {" "}
                            <path
                              d="M6 1l4 4-4 4M0 5h10"
                              strokeWidth="1.5"
                            />{" "}
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Initial Project Details Panel (z-20, left-0) --- */}
      <section
        className={cn(
          `fixed z-20 bottom-11 md:bottom-0 left-0 right-0
           ${DETAILS_PANEL_HEIGHT_MOBILE_CLASS} md:${DETAILS_PANEL_HEIGHT_DESKTOP_CLASS}
           bg-white dark:bg-black border-t border-black dark:border-neutral-700
           overflow-y-auto scrollbar-hide
           transition-transform duration-500 ease-in-out`
        )}
        style={{ transform: `translateY(${initialDetailsTranslateY})` }}
      >
        {/* Inner padding container accounts for sidebar */}
        <div className="px-4 md:pl-20 md:pr-8 py-4 md:py-5 h-full">
          {selectedProjectData && !isExpanded && (
            <>
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div>
                  <p className="text-xs uppercase text-neutral-600 dark:text-neutral-500 mb-1 tracking-wider">
                    Visit Project
                  </p>
                  <a
                    href={selectedProjectData.visitLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm md:text-base text-black dark:text-neutral-200 hover:underline"
                  >
                    {" "}
                    View{" "}
                    <svg
                      className="ml-1 w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      ></path>
                    </svg>{" "}
                  </a>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleExpand}
                    className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    Expand
                  </button>
                  <button
                    onClick={handleCloseDetails}
                    className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm md:text-base">
                {selectedProjectData.credits
                  ?.slice(0, 4)
                  .map((credit: CreditItem) => (
                    <p key={credit._key} className="truncate">
                      {" "}
                      <span className="font-medium text-black dark:text-white">
                        {credit.role || "Role"}:
                      </span>{" "}
                      {credit.name || "-"}{" "}
                    </p>
                  ))}
                {selectedProjectData.productionCo &&
                  !selectedProjectData.credits
                    ?.slice(0, 4)
                    .some((c) => c.role?.match(/Production Co/i)) && (
                    <p className="truncate">
                      {" "}
                      <span className="font-medium text-black dark:text-white">
                        Production Co:
                      </span>{" "}
                      {selectedProjectData.productionCo}{" "}
                    </p>
                  )}
                {selectedProjectData.producer &&
                  !selectedProjectData.credits
                    ?.slice(0, 4)
                    .some((c) => c.role?.match(/Producer/i)) && (
                    <p className="truncate">
                      {" "}
                      <span className="font-medium text-black dark:text-white">
                        Producer:
                      </span>{" "}
                      {selectedProjectData.producer}{" "}
                    </p>
                  )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* --- Expanded Project Details View (z-30, offset left on md+) --- */}
      <section
        className={cn(
          `fixed z-30 top-11 md:top-16 left-0 md:left-16 right-0 bottom-11 md:bottom-0
           bg-white dark:bg-black border-t border-black dark:border-neutral-700
           overflow-y-auto scrollbar-hide
           transition-opacity duration-500 ease-in-out`,
          isExpanded && selectedProjectId
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Inner padding container accounts for sidebar offset */}
        <div className="px-4 md:pl-8 md:pr-8 py-4 md:py-5 h-full">
          {/* Content */}
          {selectedProjectData && isExpanded && (
            <>
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white">
                  {selectedProjectData.title}
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={handleCollapse}
                    className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    Collapse
                  </button>
                  <button
                    onClick={handleCloseDetails}
                    className="text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="md:col-span-1 space-y-6">
                  <div>
                    <p className="text-sm uppercase text-neutral-600 dark:text-neutral-500 mb-1 tracking-wider">
                      Visit Project
                    </p>
                    <a
                      href={selectedProjectData.visitLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-base text-black dark:text-neutral-200 hover:underline"
                    >
                      {" "}
                      View{" "}
                      <svg
                        className="ml-1 w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        ></path>
                      </svg>{" "}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm uppercase text-neutral-600 dark:text-neutral-500 mb-1 tracking-wider">
                      Credits
                    </p>
                    <div className="space-y-1 text-base">
                      {selectedProjectData.credits?.map(
                        (credit: CreditItem) => (
                          <p key={credit._key}>
                            {" "}
                            <span className="font-medium text-black dark:text-white">
                              {credit.role || "Role"}:
                            </span>{" "}
                            {credit.name || "-"}{" "}
                          </p>
                        )
                      )}
                      {selectedProjectData.productionCo &&
                        !selectedProjectData.credits?.some((c) =>
                          c.role?.match(/Production Co/i)
                        ) && (
                          <p>
                            <span className="font-medium text-black dark:text-white">
                              Production Co:
                            </span>{" "}
                            {selectedProjectData.productionCo}
                          </p>
                        )}
                      {selectedProjectData.serviceProduction &&
                        !selectedProjectData.credits?.some((c) =>
                          c.role?.match(/Service Production/i)
                        ) && (
                          <p>
                            <span className="font-medium text-black dark:text-white">
                              Service Prod:
                            </span>{" "}
                            {selectedProjectData.serviceProduction}
                          </p>
                        )}
                      {selectedProjectData.producer &&
                        !selectedProjectData.credits?.some((c) =>
                          c.role?.match(/Producer/i)
                        ) && (
                          <p>
                            <span className="font-medium text-black dark:text-white">
                              Producer:
                            </span>{" "}
                            {selectedProjectData.producer}
                          </p>
                        )}
                      {selectedProjectData.client &&
                        !selectedProjectData.credits?.some((c) =>
                          c.role?.match(/Client/i)
                        ) && (
                          <p>
                            <span className="font-medium text-black dark:text-white">
                              Client:
                            </span>{" "}
                            {selectedProjectData.client}
                          </p>
                        )}
                      {selectedProjectData.director &&
                        !selectedProjectData.credits?.some((c) =>
                          c.role?.match(/Director/i)
                        ) && (
                          <p>
                            <span className="font-medium text-black dark:text-white">
                              Director:
                            </span>{" "}
                            {selectedProjectData.director}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
                {/* Right Column (Image) */}
                <div className="md:col-span-2 relative aspect-video bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
                  {selectedProjectData.mainImage?.asset && (
                    <Image
                      src={urlFor(selectedProjectData.mainImage.asset)
                        .width(1200)
                        .quality(90)
                        .auto("format")
                        .url()}
                      alt={
                        selectedProjectData.mainImage.alt ||
                        selectedProjectData.title ||
                        ""
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
