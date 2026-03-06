import type { CollectionEntry } from "astro:content";

type Note = CollectionEntry<"notes">;

export function getFeaturedNotes(notes: Note[]): Note[] {
  return notes
    .filter((note) => (note.data.priority ?? 0) > 0)
    .sort((a, b) => (b.data.priority ?? 0) - (a.data.priority ?? 0));
}
