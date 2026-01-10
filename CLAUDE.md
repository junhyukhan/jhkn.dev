# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/digital garden built with Astro, deployed to Cloudflare Pages. The site displays notes synced from iCloud and supports wiki-style internal linking between notes.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build to ./dist/
npm run preview      # Preview production build locally
npm run sync         # Sync notes from iCloud to src/content/
npm run deploy       # Deploy dist/ to Cloudflare Pages
npm run publish      # Clean, build, and deploy (full publish flow)
```

## Architecture

### Content Collections

Two content collections defined in `src/content/config.ts`:
- **writing**: Blog posts with title, pubDate, description, author, tags, draft
- **notes**: Digital garden notes synced from iCloud (includes subdirectories for LeetCode problems and quotes)

The notes collection has a schema: `created`, `edited` (optional), `tags`, `title` (optional, falls back to filename). Content is organized under `src/content/notes/` with subdirectories like `leetcode/` and `quotes/`.

### Wiki Links

The site uses `remark-wiki-link` for `[[internal links]]`. The plugin configuration in `astro.config.mjs`:
- Scans `src/content/notes/` directory (including subdirectories) at build time to generate valid permalinks
- Maps `[[Note Name]]` to `/notes/note-name`, `[[LeetCode/Problem]]` to `/notes/leetcode/problem`, etc.
- Unrecognized links fall back to `/notes/` path

### Content Sync

`npm run sync` runs `scripts/sync-public-notes.sh` which uses rsync to sync content from an iCloud path (configured via `.env` with `ICLOUD_PATH` and `REPO_CONTENT_PATH` variables) to `src/content/`.

### Styling

Uses Tailwind CSS v4 with the Typography plugin. Custom styles in `src/styles/global.css` including wiki link styling (`.internal` class for valid links, `.new` class for broken links).
