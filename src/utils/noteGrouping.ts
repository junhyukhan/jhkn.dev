import type { CollectionEntry } from "astro:content";

// Topic tags for grouping, in priority order
// Notes are grouped by their first matching topic tag
export const TOPIC_TAGS = [
  "crafting-interpreters",
  "llm",
  "cloudflare",
  "kubernetes",
  "js",
  "c",
  "nvim",
  "productivity",
] as const;

type Note = CollectionEntry<"notes">;

/**
 * Get the primary topic tag for a note (first matching topic tag)
 */
export function getNotePrimaryTopic(note: Note): string | null {
  const tags = note.data.tags || [];
  for (const topic of TOPIC_TAGS) {
    if (tags.includes(topic)) {
      return topic;
    }
  }
  return null;
}

// Acronyms that should be fully uppercased
const ACRONYMS = ["js", "llm", "c", "api"];

/**
 * Format topic tag for display (e.g., "crafting-interpreters" -> "Crafting Interpreters")
 * Handles acronyms like JS, LLM, API
 */
export function formatTopicName(topic: string): string {
  return topic
    .split("-")
    .map((word) => {
      if (ACRONYMS.includes(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Folders that should keep their folder-based grouping (not split by topic)
const FOLDER_GROUPED = ["leetcode", "quotes"] as const;

/**
 * Group notes by topic tags. Notes in special folders (leetcode/, quotes/) are grouped by folder.
 * Notes in general/ folder are grouped by their primary topic tag.
 */
export function groupNotesByTopic(
  notes: Note[]
): Record<string, { notes: Note[]; displayName: string }> {
  const groups: Record<string, { notes: Note[]; displayName: string }> = {};

  for (const note of notes) {
    const parts = note.slug.split("/");
    const folder = parts.length > 1 ? parts[0] : null;

    let groupKey: string;
    let displayName: string;

    // Check if this note is in a folder that should stay grouped by folder
    if (folder && FOLDER_GROUPED.includes(folder as typeof FOLDER_GROUPED[number])) {
      groupKey = folder;
      displayName = folder.charAt(0).toUpperCase() + folder.slice(1);
    } else {
      // Notes in general/ or root are grouped by primary topic tag
      const topic = getNotePrimaryTopic(note);
      if (topic) {
        groupKey = topic;
        displayName = formatTopicName(topic);
      } else {
        groupKey = "uncategorized";
        displayName = "Uncategorized";
      }
    }

    if (!groups[groupKey]) {
      groups[groupKey] = { notes: [], displayName };
    }
    groups[groupKey].notes.push(note);
  }

  // Sort notes within each group by created date (newest first)
  for (const group of Object.values(groups)) {
    group.notes.sort(
      (a, b) =>
        new Date(b.data.created).valueOf() - new Date(a.data.created).valueOf()
    );
  }

  return groups;
}

/**
 * Get sorted group keys with "uncategorized" always last
 */
export function getSortedGroupKeys(
  groups: Record<string, { notes: Note[]; displayName: string }>
): string[] {
  const keys = Object.keys(groups);
  return keys.sort((a, b) => {
    if (a === "uncategorized") return 1;
    if (b === "uncategorized") return -1;
    return a.localeCompare(b);
  });
}

/**
 * Get featured notes (priority > 0), sorted by priority descending
 */
export function getFeaturedNotes(notes: Note[]): Note[] {
  return notes
    .filter((note) => (note.data.priority ?? 0) > 0)
    .sort((a, b) => (b.data.priority ?? 0) - (a.data.priority ?? 0));
}
