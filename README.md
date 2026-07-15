# Astro Blog

## Project Structure

```text
/
├── scripts/              # Content sync script (iCloud vault → repo)
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   └── utils/
└── package.json
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run sync` | Sync notes from the iCloud Obsidian vault into `src/content/` |
| `npm run build` | Build your production site to `./dist/` |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run astro` | Run Astro CLI commands |
| `npm run clean` | Clean `./dist/` |
| `npm run deploy-preview` | Local preview via `wrangler dev` |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run publish` | Clean, build, and deploy to Cloudflare Workers |

