import { defineCollection, z } from "astro:content";

// Common schema for note-like content
const noteSchema = z.object({
    created: z.coerce.date(),
    edited: z.coerce.date().optional(),
    tags: z.array(z.string()).nullable().transform(t => t || []).optional().default([]),
    title: z.string().optional(),
    priority: z.number().optional().default(0),
});

const notes = defineCollection({
    type: "content",
    schema: noteSchema,
});

export const collections = { notes };
