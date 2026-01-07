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
 * @param {string} baseDir
 * @param {string} urlPrefix
 */
function getCollectionPermalinks(dir, baseDir = dir, urlPrefix = "") {
  /** @type {Record<string, string>} */
  let results = {};
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      Object.assign(results, getCollectionPermalinks(filePath, baseDir, urlPrefix));
    } else {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        // Generate slug: relative path, remove extension, lowercase, replace spaces with dashes (standard Astro/slugify)
        const relativePath = path.relative(baseDir, filePath);
        const slug = relativePath
          .replace(/\.(md|mdx)$/, "")
          .toLowerCase()
          .replace(/[^\w\s\-\/]/g, "") // Remove punctuation like ' and . but keep slashes
          .replace(/\s+/g, "-"); // Replace spaces with dashes

        // Map "Page Name" -> "/urlPrefix/slug"
        const name = file.replace(/\.(md|mdx)$/, "");

        const fullPath = urlPrefix ? `/${urlPrefix}/${slug}` : `/${slug}`;
        results[name] = fullPath;
      }
    }
  });
  return results;
}

const notePermalinks = {
  ...getCollectionPermalinks("./src/content/notes", "./src/content/notes", "notes"),
  ...getCollectionPermalinks("./src/content/leetcode", "./src/content/leetcode", "leetcode"),
  ...getCollectionPermalinks("./src/content/quotes", "./src/content/quotes", "quotes")
};

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
          if (notePermalinks[name]) {
            // Return the path relative to root, but without leading slash for some environments if needed, 
            // but usually pageResolver returns slugs. 
            // IMPORTANT: remark-wiki-link expects the "slug" that matches something in `permalinks`.
            // Since our `validPermalinks` are full paths like "/notes/foo", we return that.
            return [notePermalinks[name].replace(/^\//, "")];
          }
          // 2. Fallback: try slugifying the name directly and assume it's a note (legacy/default behavior)
          // Or better, return empty if not found so it shows as broken?
          // Let's keep a fallback for safety, defaulting to /notes/ logic if purely inferred
          const slug = name.trim().toLowerCase().replace(/[^\w\s\-\/]/g, "").replace(/\s+/g, "-");
          return [`notes/${slug}`];
        },
        hrefTemplate: (/** @type {string} */ permalink) => {
          // If the permalink is already a full path (from our map), return it as is (ensure leading slash)
          if (permalink.startsWith("/")) return permalink;
          if (permalink.startsWith("notes/") || permalink.startsWith("leetcode/") || permalink.startsWith("quotes/")) {
            return `/${permalink}`;
          }
          // Fallback
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