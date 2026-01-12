import { defineCollection, z } from "astro:content";

const writing = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        author: z.string().default("Jun Han"),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
    }),
});

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

const leetcode = defineCollection({
    type: "content",
    schema: noteSchema,
});

const quotes = defineCollection({
    type: "content",
    schema: noteSchema,
});

export const collections = { writing, notes, leetcode, quotes };
