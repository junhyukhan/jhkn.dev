# Astro Blog

## Project Structure

```text
/
├── scripts/              # Build scripts (R2 content fetch)
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
| `npm run build` | Build your production site to `./dist/` (auto-fetches content from R2) |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run astro` | Run Astro CLI commands |
| `npm run clean` | Clean `./dist/` |
| `npm run deploy-preview` | Preview deploy on Cloudflare Pages |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run publish` | Clean, build, and deploy to Cloudflare Pages |

