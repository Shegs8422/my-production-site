// src/lib/sanityclient.ts
import { createClient, type SanityClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { SanityClient } from "@sanity/client";

// --- Configuration ---
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tq8k2gol"; // Replace with your actual project ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"; // Or your dataset name
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-04-12"; // Use a recent date

// UseCdn: Set to true for production builds, false for development/preview
// Helps ensure you get fresh data in dev and cached data in prod
export const useCdn = process.env.NODE_ENV === "production";

// --- Client ---
// Create the Sanity client instance
export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  // If you need authenticated requests (for drafts/preview):
  // token: process.env.SANITY_API_READ_TOKEN,
  // perspective: 'previewDrafts', // Or 'published'
});

// --- Image URL Builder ---
// Helper function to generate image URLs from Sanity image assets
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
