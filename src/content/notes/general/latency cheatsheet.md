---
created: 2026-10-17 15:50
tags:
  - cs
  - system-design
  - cheatsheet
publish: true
---
- in-memory cache read: under 10ms
- simple user-facing read/redirect: under 100ms
- typical API request: 200-300ms
- database write or heavier API request: under 500ms
- page load or a multi-step user action: under 1 to 2 seconds
- background work such as analytics or email: seconds to minutes
