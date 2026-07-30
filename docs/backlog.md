# Backlog

Deferred, non-blocking work. State, rewritten in place — the *why* behind anything substantial
belongs in `decisions/`.

- [ ] **Wiki-link note panel — 686 lines built, stalled on 2026-03-07.** Two commits on
  `origin/claude/practical-hellman`, never merged: `Add wiki-link note panel with history
  navigation`, then `Refactor note panel into stacked-cards view`. Touches
  `src/scripts/note-panel.js` (+400), `src/styles/global.css` (+285), `src/layouts/BaseLayout.astro`
  (+1).

  **Why it's written down here rather than left on a branch.** The local branch is deleted; the
  work lives on `origin` and is one `git checkout claude/practical-hellman` away. A branch is not a
  record — after five months nobody could tell whether this was abandoned for a reason or simply
  dropped, and that ambiguity is the thing worth fixing. **No reason for the stall was ever
  recorded, so none is claimed here.** If it turns out there was one, this item is where it goes.

  Surfaced by a workspace branch audit on 2026-07-30. It had been invisible for five months
  because seven *merged* branches sat alongside it and made the list look like noise — which is
  why branch cleanup is now part of session end (`repos/docs/decisions/git-workflow.md`).
