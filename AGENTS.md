---
workspace:
  readfirst: docs/README.md
  decisions: docs/decisions/
  backlog: [docs/backlog.md]
  # build only — no lint/typecheck/test wired. The weak verifier is what caps
  # this repo at chore; promote only once something here can actually fail.
  verify: npm run build
  autonomy: chore
---

# AGENTS.md — jhkn-dev

Guidance for any coding agent working in this repository.

## Project Overview

Personal blog/digital garden built with Astro, deployed to Cloudflare Workers (push-to-deploy: commits to `main` trigger a stateless cloud build). Notes are authored in a local iCloud Obsidian vault, synced into the repo and committed; the site supports wiki-style internal linking between notes.

## Docs

Project state and decisions live in `docs/` — start at **`docs/README.md`** (status + index).
Design decisions are captured **verbatim** in `docs/decisions/` (one file per topic; copy
`docs/decisions/TEMPLATE.md`). This is the workspace-wide shape — see
`../docs/repo-docs-standardization.md`.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run sync         # Sync notes from the iCloud Obsidian vault into src/content/
npm run build        # Build to ./dist/
npm run preview      # Preview production build locally
npm run deploy       # Deploy to Cloudflare Workers (wrangler deploy)
npm run publish      # Clean, build, and deploy (full publish flow)
```

## Architecture

### Content Collections

One content collection defined in `src/content/config.ts`:
- **notes**: Digital garden notes synced from the iCloud Obsidian vault (includes subdirectories for LeetCode problems and quotes)

The notes collection schema: `created`, `edited` (optional), `tags`, `title` (optional, falls back to filename), `priority` (optional, defaults to 0). Content is organized under `src/content/notes/` with subdirectories like `leetcode/` and `quotes/`.

### Wiki Links

The site uses `remark-wiki-link` for `[[internal links]]`. The plugin configuration in `astro.config.mjs`:
- Scans `src/content/notes/` directory (including subdirectories) at build time to generate valid permalinks
- Maps `[[Note Name]]` to `/notes/note-name`, `[[LeetCode/Problem]]` to `/notes/leetcode/problem`, etc.
- Unrecognized links fall back to `/notes/` path

### Content Pipeline

Notes are **committed to git** under `src/content/notes/`. Authoring flow: edit in Obsidian → `npm run sync` → commit → push. `npm run sync` runs `scripts/sync-public-notes.sh`, which rsyncs the public notes from the local iCloud Obsidian vault (paths in `.env`: `ICLOUD_PATH`, `REPO_CONTENT_PATH`) into `src/content/`.

The Cloudflare build is **stateless**: it builds from the committed notes and fetches nothing at build time (no R2, no iCloud access in the cloud). Content must therefore be committed before pushing.

### Graph Visualization

`/graph` page (`src/pages/graph.astro`) renders an interactive force-directed graph of notes and their wiki-link connections using D3. Graph data is built by `src/utils/graph.ts`.

### Prev/Next Navigation

`src/components/PrevNext.astro` provides filter-aware sequential navigation on note pages. Respects active query parameters (search, tags, sort) to maintain context when browsing.

### Styling

Uses Tailwind CSS v4 with the Typography plugin. Custom styles in `src/styles/global.css` including wiki link styling (`.internal` class for valid links, `.new` class for broken links).
