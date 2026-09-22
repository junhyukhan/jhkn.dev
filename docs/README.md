# jhkn-dev — docs

**Read this first.** The current state of jhkn-dev, plus an index of everything under `docs/`.

## Status — resume here

<!-- What's true right now, and what to pick up next. This is *state*: rewrite it in place,
     don't append history (history lives in decisions/). -->

**Dormant, and deliberately so as of 2026-09-21.** Last code change was `1b7aa3b` (2026-07-16);
commits since are docs only. The Vite 8 / Cloudflare-plugin upgrade is **deferred** — this repo has
no Astro adapter, so it has no contact with the Vite/Workers seam and an upgrade would generate
almost nothing worth filing upstream. See
[`decisions/cloudflare-deployment.md`](decisions/cloudflare-deployment.md).

**Next up:** add oxlint (approved, independent of the upgrade), and settle what actually deploys this
site — `AGENTS.md` and `README.md` disagree, and there is no deploy job in CI. Both in
[`backlog.md`](backlog.md).

## Index

- **`decisions/`** — design decisions & specs, one file per topic, each a **verbatim ask +
  Discussion** (copy `decisions/TEMPLATE.md` to start one). The append-only record of *why*
  things are the way they are.
  - [`decisions/cloudflare-deployment.md`](decisions/cloudflare-deployment.md) — no Astro adapter,
    so `@cloudflare/vite-plugin` is absent and the Vite/Workers seam is unreachable from here;
    Vite 8 upgrade deferred 2026-09-21.
  - [`decisions/content-pipeline.md`](decisions/content-pipeline.md) — notes are committed to git,
    not fetched from R2 at build time; the build fetches nothing.
- **[`backlog.md`](backlog.md)** — deferred, non-blocking work. State, rewritten in place.

<!-- Add state singletons here as the repo grows — one file each, rewritten in place:
- **`roadmap.md`** — phases / what's planned
- **`scope.md`** — what's in and out
- **`data-model.md`** — schema reference
-->
