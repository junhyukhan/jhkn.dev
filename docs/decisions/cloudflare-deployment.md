---
type: Decision
title: Cloudflare deployment — no adapter, so the Vite/Workers seam is not reachable from this repo
description: >-
  Upgrade to Vite 8 deferred 2026-09-21. This repo has no Astro adapter, so `@cloudflare/vite-plugin`
  is absent entirely and a static asset upload generates almost no Cloudflare-specific bugs to file
  upstream; adopting `@astrojs/cloudflare` is what would create the contact surface.
status: stable
tags: [cloudflare, workers, astro, vite, deployment, upgrade, adapter]
generated: { by: claude/opus-5, at: 2026-09-20T17:50:39Z }
---

# Cloudflare deployment — no adapter, so the Vite/Workers seam is not reachable from this repo

**Status:** DECIDED (2026-09-21) — upgrade deferred, premise reopened.

## Why — the ask (verbatim)

> **Verbatim (Han, 2026-09-21, the opening ask):** "Context: I'm targeting SE/Customer Engineer
> roles at Cloudflare and VoidZero (now Cloudflare-owned; they maintain Vite, Vitest, Rolldown, Oxc,
> Vite+). Strategy: become both a user and a contributor to the Vite/Workers seam, using this blog
> as the real-world deployment that generates the issues.
>
> This repo: Astro 5 digital garden deployed to Cloudflare Workers, push-to-deploy. Dormant since
> late July 2026."

> **Verbatim (Han, 2026-09-21, Task 2 as originally scoped):** "Plan an upgrade to latest Vite 8 +
> current Cloudflare plugin + add oxlint. Keep a running log of everything that breaks, with minimal
> repros — I want to file the Cloudflare-specific ones upstream."
>
> "Don't change anything until I approve the plan."

> **Verbatim (Han, 2026-09-21, on the deploy trigger):** "i think there is a github actions
> connected that deploys when pushed to the main branch"

## Discussion

### The decision — upgrade nothing yet, and reopen the premise

Han chose **"upgrade nothing yet"** from a four-option menu. Settle the stale branches, add oxlint,
then reconsider whether a static blog is the right vehicle for reaching the Vite/Workers seam at all.

He made this decision by selecting an option rather than by writing one, so **no verbatim exists for
the pick and none is invented here** (`repos/docs/decisions/decision-capture.md`, 2026-09-20).

The finding that produced it is the headline: **the seam he wants to contribute to has no contact
with this repo today.** The strategy assumed the blog was already a real-world deployment on that
seam. It is not. Upgrading it as originally scoped would have produced a working Vite 8 build and
close to zero Cloudflare-specific bugs to file, which is the half of the strategy the upgrade was
supposed to serve.

That is why the answer is not "a smaller upgrade" but "reconsider the vehicle". A purpose-built
Workers project would reach the seam on day one. This repo needs a two-major Astro upgrade *and* an
architecture change before it generates a single issue worth filing.

### What this repo actually is

Not a Workers app. An **assets-only Worker**: a static build uploaded to Cloudflare's asset store,
with no Workers-runtime code of any kind.

| claim | how it was checked | result |
|---|---|---|
| `@cloudflare/vite-plugin` absent | `npm ls`, plus lockfile grep with a positive control | 0 hits, while `@cloudflare/*` returns 7 packages |
| `@astrojs/cloudflare` absent | same | 0 hits, while `@astrojs/*` returns 12 packages |
| never present historically | `git log -S'@astrojs/cloudflare' --all` | no hits on any branch |
| no adapter | `astro.config.mjs` | no `adapter`, no `output` |
| no Worker entry | `wrangler.json` | no `main`; only `assets.directory: ./dist` |
| no Worker output | `dist/` | no `_worker.js`, no `_routes.json` |

**The absence is proven rather than inferred**, which matters because the whole decision rests on it.
Each grep that returned zero was run beside a positive control on the same pattern and the same file,
so the probe is shown to be capable of hitting had the target been there
(`repos/docs/decisions/` — the "verify against the artifact" rule, and the `absence` skill).

Verified twice: once by the dispatched research session, then independently against the artifacts by
the workspace session before it was recorded.

### The version math forecloses the upgrade as phrased

"Latest Vite 8" is not a bump. Astro takes Vite as a **direct dependency**, not a peer, so the Vite
version is chosen by the Astro major:

| astro | vite dependency |
|---|---|
| 5.16.6 (installed) | `^6.4.1` |
| 6.4.8 | `^7.3.2` |
| 7.3.3 (latest) | `^8.0.13` |

So Vite 8 implies **Astro 5 → 7, two majors**. `@tailwindcss/vite@4.1.18` peers
`^5.2.0 || ^6 || ^7` and would have to move too; 4.3.3 adds `|| ^8`.

Installed versions at the time of this record, with no drift from the declared ranges: astro 5.16.6,
vite 6.4.1 (transitive only, undeclared), wrangler 4.54.0, tailwindcss 4.1.18, typescript 5.9.3.

### The adapter is the seam

`@astrojs/cloudflare@14.3.2` depends on `@cloudflare/vite-plugin ^1.53.0` and `vite ^8.0.13`, and
peers `astro ^7.2.0` with `wrangler ^4.125.0`.

That dependency line is the whole strategic point. **Adopting the adapter is what would put the
plugin into the build pipeline**, and therefore what would generate the upstream issues the strategy
depends on. Nothing smaller reaches it.

### Options considered and rejected

Four were put to Han. The three he did not take, with why they lost:

- **Rejected — adapter plus hybrid rendering.** Astro 5→7, Vite 8, oxlint, adopt
  `@astrojs/cloudflare`, but keep every existing page prerendered and opt only a route or two into
  on-demand rendering. This was the recommendation on the table. It reaches the seam without turning
  a site that needs no server into an SSR app. **The mechanism is my claim, not a verified one:** in
  Astro 5+ an adapter with static output still prerenders by default and a page opts out with
  `export const prerender = false`. Whether that still holds in Astro 7 was never checked, because
  the option was not taken. Anyone reviving it must verify that first.
- **Rejected — adapter plus full SSR.** Maximum contact with the Workers runtime and the most bug
  surface. Also the largest architecture change, bringing cold-start, caching and cost questions to
  a site whose content is already committed to git and needs no server at all.
- **Rejected — stay static.** Astro 5→7, Vite 8, oxlint, no adapter. The safest upgrade, and it
  would still produce real Astro-major and Vite 8 breakage worth logging. It loses because a static
  asset upload barely touches `@cloudflare/vite-plugin`, so it serves the "user" half of the strategy
  and not the "contributor" half.

None of these is dead. The decision defers the choice rather than closing it, and the reopened
question — this repo versus a purpose-built Workers project — may retire all three.

### Open and explicitly unverified — what actually triggers a deploy

**Do not read this repo's own claim as settled.** `AGENTS.md` says "push-to-deploy: commits to `main`
trigger a stateless cloud build". `README.md:33-35` documents only manual `npm run deploy`. One of
them is stale and this record does not resolve which.

What the repo proves, as of `6c82bd5`:

- `.github/workflows/` contains exactly one file, `claude.yml` (the @claude bot), on `main` and on
  both stale branches. It has no deploy job.
- `grep -rn -i "deploy\|wrangler" .github/` returns nothing.
- `git log --all --diff-filter=D -- .github/workflows/` returns nothing, so no deploy workflow was
  ever removed.
- `wrangler.json` carries no build configuration.

So **it is not GitHub Actions**, contrary to Han's recollection quoted above. If push-to-deploy is
real, it is **Cloudflare Workers Builds connected dashboard-side**, which no file in this repo can
show. That is the remaining possibility and it is untested.

It could not be settled from here because **Han's stored wrangler OAuth refresh token is expired or
revoked** (`invalid_grant`), so `wrangler deployments list` fails and `npm run deploy` would fail
locally today. `wrangler login` is the prerequisite for answering this, and it is his to run.

Until it is answered, treat the deploy path as unknown rather than as either file describes it.

### What is provisional, and what should trigger a revisit

- **The deferral itself.** Revisit when the vehicle question is answered: if Han keeps this repo as
  the contribution surface, the adapter options above come straight back. If he builds a separate
  Workers project instead, this record becomes the explanation for why the blog stayed static.
- **oxlint is approved and independent of all of it.** It is also the only thing that would give this
  repo a real verification gate. Today `npm run build` is the entire verifier, which is why the
  orchestrator caps this repo at `chore` autonomy
  (`repos/agentlab/docs/decisions/orchestrator.md`). Landing oxlint is what would make a two-major
  upgrade safe to dispatch rather than something a session has to babysit.
- **Sequencing is my judgment call, not Han's:** branches first, then oxlint, then any upgrade. The
  reason is that oxlint's baseline should cover whatever code survives the branch decision, rather
  than needing a second pass.

## Related records

- [`content-pipeline.md`](content-pipeline.md) — notes are committed to git and the Cloudflare build
  fetches nothing. That statelessness is what makes the static shape viable in the first place.
- [`../backlog.md`](../backlog.md) — the two stale branches and what was kept from them.
- [`repos/docs/decisions/git-workflow.md`](../../../docs/decisions/git-workflow.md) — the
  2026-09-21 amendment on disposing of regenerable branch code while keeping its intent. That
  decision was applied here first.
