import type { CollectionEntry } from "astro:content";
import { extractWikiLinks, linkMatchesNote } from "./backlinks";
import { getNoteTitle } from "./note";

type Note = CollectionEntry<"notes">;

export interface GraphNode {
  id: string;
  slug: string;
  title: string;
  group: string;
  tags: string[];
  linkCount: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function buildGraphData(allNotes: Note[]): GraphData {
  const nodes: GraphNode[] = allNotes.map((note) => {
    const segments = note.id.split("/");
    const group = segments.length > 1 ? segments[0] : "general";
    return {
      id: note.id,
      slug: note.slug,
      title: getNoteTitle(note),
      group,
      tags: note.data.tags || [],
      linkCount: 0,
    };
  });

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const links: GraphLink[] = [];
  const seen = new Set<string>();

  for (const note of allNotes) {
    const wikiLinks = extractWikiLinks(note.body || "");
    for (const link of wikiLinks) {
      for (const target of allNotes) {
        if (note.id === target.id) continue;
        if (linkMatchesNote(link, target)) {
          const key = `${note.id}→${target.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            links.push({ source: note.id, target: target.id });
            nodeById.get(note.id)!.linkCount++;
            nodeById.get(target.id)!.linkCount++;
          }
          break;
        }
      }
    }
  }

  return { nodes, links };
}
