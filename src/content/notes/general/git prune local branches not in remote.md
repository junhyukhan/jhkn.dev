---
tags:
  - cs
  - git
created: 2026-01-21 14:07
edited: 2026-01-21 14:07
---
```bash
git fetch --prune
# or simply
git fetch -p
```

```bash
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D 
# or -d for safe deletion of branches that have been fully merged into their remote branches
```