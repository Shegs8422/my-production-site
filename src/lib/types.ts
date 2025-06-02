// src/lib/types.ts
// Define the structure for a single credit item
export interface CreditItem {
  _key: string; // Sanity assigns unique keys to array items
  role?: string;
  name?: string;
}

// Define the structure for an image asset
export interface ImageAsset {
  _ref: string; // The asset ID
  _type: "reference";
}

// Define the structure for a slug
export interface Slug {
  _type: "slug";
  current: string;
}

// Define the main structure for your project documents
export interface SanityProject {
  // Core Sanity fields
  _id: string;
  _type: "project";
  _createdAt?: string;
  _updatedAt?: string;

  // Your defined fields (match your schema)
  title?: string;
  slug?: Slug;
  orderRank?: number;
  client?: string;
  director?: string;
  externalLink?: string; // Renamed from 'link' in ndjson
  visitLink?: string; // Renamed from 'visitProjectLink' in ndjson
  mainImage?: {
    // Image object
    asset: ImageAsset; // This is what urlFor expects
    alt?: string; // Alt text
    // Sanity might add hotspot/crop data here if enabled
  };
  credits?: CreditItem[]; // Array of credit items
  // Add simple fields like productionCo, serviceProduction if defined separately
  productionCo?: string;
  serviceProduction?: string;
  producer?: string;
}
