// studio/schemaTypes/project.ts
import {defineField, defineType} from 'sanity'
import {PresentationIcon} from '@sanity/icons'

export default defineType({
  // Technical name of the schema
  name: 'project',
  // Human-readable title in the Studio
  title: 'Project',
  // Specifies that this schema defines a document type
  type: 'document',
  // Icon for the Studio UI
  icon: PresentationIcon,

  // Defines how documents of this type can be sorted in lists
  orderings: [
    {
      title: 'Manual Order',
      name: 'manualOrder',
      // Sort by the 'orderRank' field in ascending order
      by: [{field: 'orderRank', direction: 'asc'}],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      // Sort by the 'title' field in ascending order
      by: [{field: 'title', direction: 'asc'}],
    },
  ],

  // Defines the fields within the 'project' document type
  fields: [
    // Corresponds to the `title` field in the ndjson
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main title of the project.',
      validation: (Rule) => Rule.required(), // Make title mandatory
    }),

    // Corresponds to the `slug` object in the ndjson
    defineField({
      name: 'slug',
      title: 'Slug (URL Path)',
      type: 'slug',
      options: {
        source: 'title', // Automatically generate slug from the 'title' field
        maxLength: 96, // Limit slug length
      },
      validation: (Rule) => Rule.required(), // Make slug mandatory
    }),

    // Corresponds to the `orderRank` field in the ndjson
    defineField({
      name: 'orderRank',
      title: 'Manual Order Rank',
      type: 'number',
      description: 'Lower numbers appear first when sorting manually.',
      // Hidden: true, // Optionally hide if managed by a custom input or drag-and-drop
    }),

    // Corresponds to the `client` field in the ndjson
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'The primary client or artist for the project.',
    }),

    // Corresponds to the `director` field in the ndjson
    defineField({
      name: 'director',
      title: 'Director',
      type: 'string',
      description: 'Director(s) of the project.',
    }),

    // Corresponds to the `externalLink` field in the ndjson
    defineField({
      name: 'externalLink',
      title: 'External Link (e.g., YouTube, Vimeo)',
      type: 'url',
      description: 'The main link to view the project.',
    }),

    // Corresponds to the `visitProjectLink` field in the ndjson
    defineField({
      name: 'visitProjectLink',
      title: 'Visit Project Link (Optional)',
      type: 'url',
      description: 'An optional secondary link (e.g., campaign site, product page).',
    }),

    // Corresponds to the `mainImage` object in the ndjson
    defineField({
      name: 'mainImage',
      title: 'Main Project Image',
      type: 'image',
      options: {
        hotspot: true, // Enables hotspot cropping
      },
      // Defines custom fields within the image object
      fields: [
        {
          // Corresponds to the `alt` field within the `mainImage` object in ndjson
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(), // Make alt text mandatory
        },
      ],
      validation: (Rule) => Rule.required(), // Ensure an image is always added
    }),

    // Corresponds to the `credits` array in the ndjson
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      description: 'Add roles and names for project credits.',
      // Defines the type of items allowed in this array
      of: [
        {
          // Each item in the array is an object
          type: 'object',
          name: 'creditItem',
          title: 'Credit Item',
          // Defines the fields within each credit item object
          fields: [
            // Corresponds to the `role` field within each credits object in ndjson
            {name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required()},
            // Corresponds to the `name` field within each credits object in ndjson
            {name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()},
            // Note: `_key` is handled automatically by Sanity for array items
          ],
          // Defines how each credit item is displayed in the array list view in the Studio
          preview: {
            select: {
              role: 'role',
              name: 'name',
            },
            prepare({role, name}) {
              // Format the preview title like "Role: Name"
              return {title: `${role || 'No Role'}: ${name || 'No Name'}`}
            },
          },
        },
      ],
    }),
    // Note: The `_id` and `_type` fields from ndjson are automatically handled by Sanity.
    // `_id` becomes the document ID (often generated from title/slug or a UUID).
    // `_type` corresponds to the `name` ('project') of this schema definition.
  ],

  // Defines how documents of this type are previewed in lists and references
  preview: {
    select: {
      // Select fields to use in the preview
      title: 'title',
      client: 'client',
      media: 'mainImage', // Use the main image as the preview media
    },
    prepare(selection) {
      const {title, client, media} = selection
      // Return the formatted preview object
      return {
        title: title || 'Untitled Project', // Fallback title
        subtitle: client ? `Client: ${client}` : '', // Show client in subtitle if present
        media: media || PresentationIcon, // Show image or fallback icon
      }
    },
  },
})
