---
tags:
  - cs
  - tips
  - vim
created: 2023-09-18 09:00
---

# Search and Replace
```
:%s/[find]/[replace]/g
// % searches for the entire file
// g replaces all occurances in the current line
```

### Escape characters

There are many special characters that need to be escaped when searching. For example, when searching for `[0]`, the brackets need to be escaped resulting in `\[0\]`. There are many other special characters that need to be escaped like backslash itself (`\\`).