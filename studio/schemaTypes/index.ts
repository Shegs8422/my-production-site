// studio/schemaTypes/index.ts (or schemas/index.ts)
// import blockContent from './blockContent' // Example existing type
import project from './project' // <-- Import your new schema

export const schemaTypes = [
  // Document types
  project, // <-- Add your project type

  // Other types
//   blockContent, // Example existing type
  // Add other types here
]
