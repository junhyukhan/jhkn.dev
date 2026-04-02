# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/digital garden built with Astro, deployed to Cloudflare Pages. The site displays notes synced from iCloud and supports wiki-style internal linking between notes.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build to ./dist/ (auto-runs prebuild first)
npm run preview      # Preview production build locally
npm run deploy       # Deploy dist/ to Cloudflare Pages
npm run publish      # Clean, build, and deploy (full publish flow)
```

## Architecture

### Content Collections

One content collection defined in `src/content/config.ts`:
- **notes**: Digital garden notes synced from iCloud/R2 (includes subdirectories for LeetCode problems and quotes)

The notes collection schema: `created`, `edited` (optional), `tags`, `title` (optional, falls back to filename), `priority` (optional, defaults to 0). Content is organized under `src/content/notes/` with subdirectories like `leetcode/` and `quotes/`.

### Wiki Links

The site uses `remark-wiki-link` for `[[internal links]]`. The plugin configuration in `astro.config.mjs`:
- Scans `src/content/notes/` directory (including subdirectories) at build time to generate valid permalinks
- Maps `[[Note Name]]` to `/notes/note-name`, `[[LeetCode/Problem]]` to `/notes/leetcode/problem`, etc.
- Unrecognized links fall back to `/notes/` path

### Content Pipeline

`npm run prebuild` (auto-runs before `npm run build`) executes `scripts/fetch-r2-vaults.js`, which pulls notes from a Cloudflare R2 bucket (`01_public/notes/` prefix) into `src/content/notes/`. Notes are **not committed to git** — they're fetched fresh each build for stateless Cloudflare Pages deploys. R2 credentials are configured via `.env` (do not read or modify this file).

### Graph Visualization

`/graph` page (`src/pages/graph.astro`) renders an interactive force-directed graph of notes and their wiki-link connections using D3. Graph data is built by `src/utils/graph.ts`.

### Prev/Next Navigation

`src/components/PrevNext.astro` provides filter-aware sequential navigation on note pages. Respects active query parameters (search, tags, sort) to maintain context when browsing.

### Styling

Uses Tailwind CSS v4 with the Typography plugin. Custom styles in `src/styles/global.css` including wiki link styling (`.internal` class for valid links, `.new` class for broken links).
