import type { CollectionEntry } from "astro:content";

export function getNoteTitle(note: { data: { title?: string }, id: string }): string {
    if (note.data.title) {
        return note.data.title;
    }
    // Fallback to filename from ID
    // ID format: "folder/filename.md" or "filename.md"
    const segments = note.id.split("/");
    const filename = segments[segments.length - 1];
    return filename.replace(/\.(md|mdx)$/, "");
}
