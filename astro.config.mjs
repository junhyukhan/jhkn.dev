// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import wikiLinkPlugin from "remark-wiki-link";
import fs from "fs";
import path from "path";

// Helper to recursively find all markdown files
/**
 * @param {string} dir
 * @param {string} [baseDir]
 */
function getNotePermalinks(dir, baseDir = dir) {
  /** @type {Record<string, string>} */
  let results = {};
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      Object.assign(results, getNotePermalinks(filePath, baseDir));
    } else {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        // Generate slug: relative path, remove extension, lowercase, replace spaces with dashes (standard Astro/slugify)
        const relativePath = path.relative(baseDir, filePath);
        const slug = relativePath
          .replace(/\.(md|mdx)$/, "")
          .toLowerCase()
          .replace(/[^\w\s\-\/]/g, "") // Remove punctuation like ' and . but keep slashes
          .replace(/\s+/g, "-"); // Replace spaces with dashes

        // Map "Page Name" -> "slug"
        // "Page Name" comes from filename without extension.
        const name = file.replace(/\.(md|mdx)$/, "");
        // Also map the full relative path if user types "dev/Page Name"? 
        // For now, support "Page Name" (Obsidian behavior).
        results[name] = slug;
        // Support "folder/Page Name" style too for disambiguation?
        // This simple map implies last-write-wins for duplicate filenames in different folders.
        // This is a known trade-off.
      }
    }
  });
  return results;
}

const notePermalinks = getNotePermalinks("./src/content/notes");
const validPermalinks = Object.values(notePermalinks);

// https://astro.build/config
export default defineConfig({
  site: "https://jhkn.dev",
  markdown: {
    remarkPlugins: [
      [wikiLinkPlugin, {
        permalinks: validPermalinks,
        // Map [[Link]] to specific slugs using our scanned list
        pageResolver: (/** @type {string} */ name) => {
          // 1. Try exact match from our map
          if (notePermalinks[name]) return [notePermalinks[name]];
          // 2. Fallback: try slugifying the name directly
          return [name.trim().toLowerCase().replace(/[^\w\s\-\/]/g, "").replace(/\s+/g, "-")];
        },
        hrefTemplate: (/** @type {string} */ permalink) => {
          // If the permalink is already a full path (from our map), prepend /notes/
          // If it's a relative path, ensure it starts with /notes/
          if (permalink.startsWith("/notes/")) return permalink;
          return `/notes/${permalink}`;
        }
      }]
    ],
    shikiConfig: {
      theme: "github-light",
      wrap: true,
    }
  },
  integrations: [
    sitemap(),
    mdx()
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});