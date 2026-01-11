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
 * Normalize a string for comparison
 * - Lowercase
 * - Collapse whitespace
 * - Trim
 * Preserves meaningful punctuation (., +, #, etc.) to avoid false matches
 * e.g., "C++" and "C" remain distinct
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, " ")
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
 * Build a map of all backlinks for all notes (O(n²) but computed once at build time)
 * Returns a Map where keys are note IDs and values are arrays of notes that link to them
 */
export function buildBacklinksMap(allNotes: Note[]): Map<string, Note[]> {
  const backlinksMap = new Map<string, Note[]>();

  // Initialize empty arrays for all notes
  for (const note of allNotes) {
    backlinksMap.set(note.id, []);
  }

  // For each note, find what it links to and add itself as a backlink
  for (const sourceNote of allNotes) {
    const links = extractWikiLinks(sourceNote.body || "");

    for (const targetNote of allNotes) {
      // Skip self-references
      if (sourceNote.id === targetNote.id) continue;

      // Check if sourceNote links to targetNote
      for (const link of links) {
        if (linkMatchesNote(link, targetNote)) {
          backlinksMap.get(targetNote.id)!.push(sourceNote);
          break; // Only add once even if multiple links
        }
      }
    }
  }

  // Sort each backlinks array by created date (newest first)
  for (const [, backlinks] of backlinksMap) {
    backlinks.sort(
      (a, b) =>
        new Date(b.data.created).valueOf() - new Date(a.data.created).valueOf()
    );
  }

  return backlinksMap;
}
