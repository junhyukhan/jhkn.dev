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
        title: z.string(),
        pubDate: z.date(), // Optional for notes? Keeping it required for now based on plan "looser schema" but date is usually good.
        tags: z.array(z.string()).default([]),
    }),
});

export const collections = { writing, notes };
