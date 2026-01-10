import type { CollectionEntry } from "astro:content";
import { getNoteTitle } from "./note";

type Note = CollectionEntry<"notes">;

/**
 * Extract wiki link targets from markdown content
 * Handles both [[Link]] and [[Link|Display Text]] formats
 */
export function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    links.push(match[1].trim());
  }

  return links;
}

/**
 * Normalize a string for comparison (lowercase, remove punctuation, trim)
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

/**
 * Get the filename from a note's ID (without extension)
 */
function getFilename(note: Note): string {
  const segments = note.id.split("/");
  const filename = segments[segments.length - 1];
  return filename.replace(/\.(md|mdx)$/, "");
}

/**
 * Check if a wiki link target matches a note
 * Matches against title and filename (case-insensitive)
 */
function linkMatchesNote(linkTarget: string, note: Note): boolean {
  const normalizedLink = normalize(linkTarget);
  const normalizedTitle = normalize(getNoteTitle(note));
  const normalizedFilename = normalize(getFilename(note));

  return normalizedLink === normalizedTitle || normalizedLink === normalizedFilename;
}

/**
 * Get all notes that link to the given note
 */
export function getBacklinksForNote(targetNote: Note, allNotes: Note[]): Note[] {
  const backlinks: Note[] = [];

  for (const note of allNotes) {
    // Skip self-references
    if (note.id === targetNote.id) continue;

    const links = extractWikiLinks(note.body || "");
    for (const link of links) {
      if (linkMatchesNote(link, targetNote)) {
        backlinks.push(note);
        break; // Only add each note once even if it links multiple times
      }
    }
  }

  // Sort by created date (newest first)
  backlinks.sort(
    (a, b) =>
      new Date(b.data.created).valueOf() - new Date(a.data.created).valueOf()
  );

  return backlinks;
}
