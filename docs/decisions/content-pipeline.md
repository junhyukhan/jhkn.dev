---
type: Decision
title: Content pipeline — how notes get from Obsidian into the build
description: >-
  R2 was dropped 2026-07-16 and notes are committed to git under `src/content/notes/`, synced
  across from the iCloud Obsidian vault, so the Cloudflare build is stateless.
status: stable
tags: [jhkn-dev, content, obsidian, cloudflare, r2, build]
generated: { by: claude/opus-5, at: 2026-07-30T00:00:00Z }
---

# Content pipeline — how notes get from Obsidian into the build

**Status:** DECIDED · record written 2026-07-30, reconstructed from artifacts

Governs how `src/content/notes/` is populated and what the Cloudflare build depends on.

> ## ⚠ No verbatim ask — this record is reconstructed
>
> The decision was made on **2026-07-16**. The convention requiring a record with Han's exact words
> landed on **2026-07-19**, and this repo's `docs/decisions/` was created on **2026-07-24** — both
> *after*. Dated against `git log` before writing, per
> `config/docs/decisions/artifact-checking.md`. Nothing was skipped at the time.
>
> **Reconstructed from commit `1b7aa3b` and the current tree — not from Han.** The reasoning is his;
> the wording is the agent's, written at commit time. No quote is presented as verbatim. If Han wants
> his own framing here, it belongs above the Discussion as a dated quote.
>
> Surfaced 2026-07-30 by the records-owed check in `repos/ops/index.py`.

## 2026-07-16 — drop R2; commit the notes to git

**Source:** commit `1b7aa3b` — *"Drop R2, commit notes to git for stateless Cloudflare build"*.

### Discussion

**What it replaced.** The build fetched note content from Cloudflare R2 at build time, via
`scripts/fetch-r2-vaults.js` (115 lines) wired in as a `prebuild` step, with `@aws-sdk/client-s3` as
a dependency.

**What it became.** Notes are committed to the repo under `src/content/notes/` (previously
gitignored), authored in the local iCloud Obsidian vault and moved across by
`scripts/sync-public-notes.sh` — the `npm run sync` step. The authoring loop is now
*edit in Obsidian → sync → commit → push*, and the Cloudflare build **fetches nothing**.

### Why this is the right shape for this repo

- **A build that fetches at build time can fail for reasons that have nothing to do with the
  commit.** R2 credentials, bucket state, and network are all inputs that don't live in git, so the
  build was not a function of the repo. Committing the content makes it one — the same property that
  makes `journal/generate.py` and the ops checker safe in the wider workspace: derived from what's in
  git, reproducible anywhere.
- **It removed a dependency and a whole build stage**, not just a data source. `@aws-sdk/client-s3`
  and the prebuild hook went with it.
- **It survives a clone.** Anyone (including a future Han) can clone this repo and build it. That is
  the same property that later decided where decision records live — see
  `repos/docs/decisions/decision-capture.md`.

### The cost, stated plainly

- **Content and code share a history.** Note edits now appear as commits in a code repo, and the
  diff for a prose change sits alongside source. The commit that made the switch added the entire
  existing vault in one go.
- **Publishing requires a commit.** There is no longer a path where content updates without a
  deploy — `npm run sync` then commit then push. Whether that is friction or a feature depends on
  how often notes change; it has not been revisited since.
- **Two copies of the notes exist** — the iCloud Obsidian vault (authoring) and `src/content/notes/`
  (published). `sync-public-notes.sh` is the only thing keeping them aligned, and it is one-way.

**Also in this commit, unrelated to R2:** the deploy scripts moved from `wrangler pages deploy` to
`wrangler deploy` (Workers, not Pages). Recorded here only because it shipped together; it is not
part of this decision.

### Open

Nothing was recorded about *why R2 was chosen originally*, so this record cannot say what changed
Han's mind — only what the new shape is and what it costs. If the reason mattered, it is gone.

## Related

- [`../backlog.md`](../backlog.md)
- [`repos/docs/decisions/decision-capture.md`](../../../docs/decisions/decision-capture.md)
