import type { CollectionEntry } from "astro:content";
import { getNoteTitle } from "./note";

type Note = CollectionEntry<"notes">;

export interface BacklinkWithContext {
  note: Note;
  context: string; // HTML-safe snippet with <strong> around the link mention
}

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
 */
export function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Get the filename from a note's ID (without extension)
 */
export function getFilename(note: Note): string {
  const segments = note.id.split("/");
  const filename = segments[segments.length - 1];
  return filename.replace(/\.(md|mdx)$/, "");
}

/**
 * Check if a wiki link target matches a note
 */
export function linkMatchesNote(linkTarget: string, note: Note): boolean {
  const normalizedLink = normalize(linkTarget);
  const normalizedTitle = normalize(getNoteTitle(note));
  const normalizedFilename = normalize(getFilename(note));

  return normalizedLink === normalizedTitle || normalizedLink === normalizedFilename;
}

/**
 * Strip markdown syntax for plain-text display
 */
function stripMarkdown(text: string): string {
  return text
    // Remove wiki links but keep display text: [[target|display]] → display, [[target]] → target
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    // Remove markdown links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove bold/italic markers
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove heading markers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove blockquote markers
    .replace(/^>\s+/gm, "")
    // Remove list markers
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .trim();
}

/**
 * Extract a context snippet from a source note's body around a wiki link to a target note.
 * Returns an HTML-safe string with the link mention wrapped in <strong>.
 */
function extractContext(sourceBody: string, targetNote: Note): string {
  const title = getNoteTitle(targetNote);
  const filename = getFilename(targetNote);

  // Find paragraphs (split on double newlines)
  const paragraphs = sourceBody.split(/\n{2,}/);

  for (const para of paragraphs) {
    // Check if this paragraph contains a wiki link to the target
    const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
    let match;
    while ((match = wikiLinkRegex.exec(para)) !== null) {
      const linkTarget = match[1].trim();
      if (
        normalize(linkTarget) === normalize(title) ||
        normalize(linkTarget) === normalize(filename)
      ) {
        // Found a matching paragraph — clean it up
        let cleaned = stripMarkdown(para).replace(/\s+/g, " ").trim();

        // Truncate if too long, preserving word boundaries
        if (cleaned.length > 200) {
          // Try to center the truncation around the mention
          const mentionIdx = cleaned.toLowerCase().indexOf(title.toLowerCase());
          if (mentionIdx > 80) {
            cleaned = "…" + cleaned.slice(mentionIdx - 60);
          }
          if (cleaned.length > 200) {
            cleaned = cleaned.slice(0, 197) + "…";
          }
        }

        // Highlight the target note's title in the snippet
        // Escape HTML first
        cleaned = cleaned
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // Bold the mention (case-insensitive)
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const mentionPattern = new RegExp(
          `(${escapedTitle}|${escapedFilename})`,
          "gi"
        );
        cleaned = cleaned.replace(mentionPattern, "<strong>$1</strong>");

        return cleaned;
      }
    }
  }

  return "";
}

/**
 * Build a map of backlinks with context snippets for all notes.
 * Each backlink includes the paragraph where the link occurs.
 */
export function buildBacklinksWithContextMap(
  allNotes: Note[]
): Map<string, BacklinkWithContext[]> {
  const map = new Map<string, BacklinkWithContext[]>();

  for (const note of allNotes) {
    map.set(note.id, []);
  }

  for (const sourceNote of allNotes) {
    const links = extractWikiLinks(sourceNote.body || "");

    for (const targetNote of allNotes) {
      if (sourceNote.id === targetNote.id) continue;

      for (const link of links) {
        if (linkMatchesNote(link, targetNote)) {
          const context = extractContext(
            sourceNote.body || "",
            targetNote
          );
          map.get(targetNote.id)!.push({ note: sourceNote, context });
          break;
        }
      }
    }
  }

  for (const [, backlinks] of map) {
    backlinks.sort(
      (a, b) =>
        new Date(b.note.data.created).valueOf() -
        new Date(a.note.data.created).valueOf()
    );
  }

  return map;
}
