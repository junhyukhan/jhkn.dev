---
tags:
  - cs
  - blog
  - feature
created: 2026-01-06 17:35
edited: 2026-01-06 17:35
---
- [ ] UI
	- [ ] Add tags in the notes list to easily view different groups.
		- [ ] Perhaps I should group them
	- [ ] Implement a pinned notes section
	- [ ] Clear distinction between broken and valid internal links
- [ ] Content
	- [ ] [[publish obsidian notes to notes section]]
	- [ ] Copy existing blog content to new blog
- [ ] deploy using cloudflare pages
	- [x] Serve built dist folder directly
	- [ ] Npm run build (requires content to be tracked by git)
- [ ] Enable a CI/CD pipeline that automatically publishes new notes marked as published
- [ ] Tests
	- [ ] Valid links are accessible (obsidian uses a [[shortest path when possible]] linking system)
- [ ] Unsure
	- [ ] View count
	- [ ] Minutes to read
	- [ ] Comments section
	- [ ] Like button