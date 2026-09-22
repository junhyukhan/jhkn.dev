# Backlog

Deferred, non-blocking work. State, rewritten in place — the *why* behind anything substantial
belongs in `decisions/`.

- [ ] **Wiki-link note panel — designed and built once, branch deleted 2026-09-22.** Open a note's
  wiki-links in a side panel with history navigation, rather than navigating away from the page.
  The second commit reshaped it into a **stacked-cards view**, so following a chain of `[[links]]`
  leaves a readable stack behind you instead of a single replaced pane.

  **The code is gone on purpose; this entry is what replaces it.** 686 lines across
  `src/scripts/note-panel.js` (+400, new file), `src/styles/global.css` (+285) and
  `src/layouts/BaseLayout.astro` (+1), on `origin/claude/practical-hellman` (`f150051` then
  `a24e551`, 2026-03-07), never merged. Deleted under the 2026-09-21 rule, applied 2026-09-22, that
  regenerable code is not worth preserving while the intent behind it is
  (`repos/docs/decisions/git-workflow.md`). **Do not treat those SHAs as a recovery path** — after a
  remote branch is deleted the commits are unreachable and get collected. Rebuild from this
  description instead.

  **What was learned before it was deleted, and is worth keeping.** The implementation scraped
  `article.prose` and hooked `a.internal`. Both still exist on `main` today
  (`src/pages/notes/[...slug].astro:26`, and `.internal` styled at `src/styles/global.css:45`), so
  the approach still fits the current markup. Rebase cost was **estimated from diff hunks and never
  measured**: one real conflict in `global.css`, where the branch and `main` both append at the same
  seam, plus an adjacent-but-not-overlapping insert in `BaseLayout.astro`.

  **No reason for the stall was ever recorded, so none is claimed here.** If it turns out there was
  one, this item is where it goes.

  Surfaced by a workspace branch audit on 2026-07-30. It had been invisible for five months because
  seven *merged* branches sat alongside it and made the list look like noise, which is why branch
  cleanup is now part of session end (`repos/docs/decisions/git-workflow.md`).

- [ ] **Home page — featured and recent sections, branch deleted 2026-09-22.** Three changes, all
  to the home page's two lists:

  1. **Recent excludes the sub-collections.** `quotes/` and `leetcode/` notes are filtered out of
     the recent list, so the home page shows actual writing rather than whatever synced last.
  2. **Recent shows 5, not 3.**
  3. **Featured Work becomes cards.** Instead of rendering the plain `NoteList` rows, each featured
     note gets a bordered card carrying its title, its ISO creation date, and its tags as chips.
     `NoteList` itself gained an optional `showTags` prop that renders tags under the title, so the
     plain list can opt into the same information without the card chrome.

  **Captured here on 2026-09-22 specifically so the branch could be deleted.** It was the one stale
  branch with no record at all. 52 insertions, 11 deletions across `src/pages/index.astro` and
  `src/components/NoteList.astro`, on `origin/claude/improve-home-page-xKxSv` (`73370ac`,
  2026-03-18), never merged. Same rule and the same warning as above: the SHA is not a recovery
  path, and the code is meant to be rebuilt rather than restored.

  **No reason for the stall was recorded here either.** The two branches are six months old and
  unrelated to each other; nothing suggests either was abandoned on purpose.

- [ ] **Add oxlint — approved 2026-09-21, not started.** Independent of the deferred upgrade, and
  worth doing on its own: `npm run build` is currently the repo's entire verification gate, which is
  why the orchestrator caps this repo at `chore` autonomy. A real linter is what would make a large
  dependency upgrade safe to dispatch. Record: [`decisions/cloudflare-deployment.md`](decisions/cloudflare-deployment.md).

- [ ] **Settle what actually deploys this site.** `AGENTS.md` claims push-to-deploy on `main`;
  `README.md:33-35` documents only manual `npm run deploy`; there is no deploy job in
  `.github/workflows/` and never has been. If push-to-deploy is real it is Cloudflare Workers Builds,
  configured dashboard-side. Needs `wrangler login` first — the stored OAuth token is expired or
  revoked (`invalid_grant`). Whichever answer comes back, one of those two files is stale and should
  be fixed. Record: [`decisions/cloudflare-deployment.md`](decisions/cloudflare-deployment.md).
