---
tags:
  - cs
  - blog
  - feature
created: 2026-01-06 10:01
edited: 2026-01-06 10:01
---
Initial thought process:
I want to distinguish between public/private and published/draft.
- Public notes should be tracked by git.
- Public notes can either be published or draft.
- Private notes should never be tracked by git.
I want to keep my current obsidian folder structure. I do not want to designate a separate public folder.

First approach was to include a published (boolean) and public (boolean) fields in the properties section which can be easily checked in astro.

The problem with this approach is that I have to keep my content in an obsidian vault which is
1. Synced using icloud so I needed a way to avoid using git in the actual vault.
2. [[Git does not track contents of a symlinked directory]]
3. To enable cloud builds, I need to track my public notes in git

For now, I have created a public directory inside my obsidian vault and created a symlink to only that directory from my obsidian contents section.
Meaning right now, I can only build and deploy from my local dev environment.