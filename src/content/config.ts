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

const notes = defineCollection({
    type: "content",
    schema: z.object({
        created: z.coerce.date(),
        edited: z.coerce.date().optional(),
        tags: z.array(z.string()).nullable().transform(t => t || []).optional().default([]),
        title: z.string().optional(),
        // pubDate: z.date().optional(),
    }),
});

export const collections = { writing, notes };
