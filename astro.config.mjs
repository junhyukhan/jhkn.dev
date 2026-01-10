// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import wikiLinkPlugin from "remark-wiki-link";
import fs from "fs";
import path from "path";

// Helper to recursively find all markdown files and build permalink map
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
        const relativePath = path.relative(baseDir, filePath);
        // Generate slug: relative path, remove extension, lowercase, replace spaces with dashes
        const slug = relativePath
          .replace(/\.(md|mdx)$/, "")
          .toLowerCase()
          .replace(/[^\w\s\-\/]/g, "") // Remove punctuation but keep slashes
          .replace(/\s+/g, "-"); // Replace spaces with dashes

        const name = file.replace(/\.(md|mdx)$/, "");
        // Store WITHOUT leading slash so it matches what pageResolver returns
        const permalink = urlPrefix ? `${urlPrefix}/${slug}` : slug;
        results[name] = permalink;
      }
    }
  });
  return results;
}

// All content is under src/content/notes/ with subfolders
const notePermalinks = getCollectionPermalinks("./src/content/notes", "./src/content/notes", "notes");

// Build validPermalinks array (without leading slashes to match pageResolver output)
const validPermalinks = Object.values(notePermalinks);

// https://astro.build/config
export default defineConfig({
  site: "https://jhkn.dev",
  markdown: {
    remarkPlugins: [
      [wikiLinkPlugin, {
        permalinks: validPermalinks,
        pageResolver: (/** @type {string} */ name) => {
          // Exact match by filename
          if (notePermalinks[name]) {
            return [notePermalinks[name]];
          }
          // Case-insensitive match
          const lowerName = name.toLowerCase();
          for (const [key, value] of Object.entries(notePermalinks)) {
            if (key.toLowerCase() === lowerName) {
              return [value];
            }
          }
          // Fallback: slugify and assume it's a note (will show as "new" link)
          const slug = name.trim().toLowerCase().replace(/[^\w\s\-\/]/g, "").replace(/\s+/g, "-");
          return [`notes/${slug}`];
        },
        hrefTemplate: (/** @type {string} */ permalink) => `/${permalink}`
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