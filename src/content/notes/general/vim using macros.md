---
tags:
  - cs
  - tips
  - vim
created: 2023-09-18 09:00
---

# Using Macros

```
// To create a macro
q<letter><command>q

// To use the macro
<number>@<letter> // where number defaults to 1
```

### Example usage

1. press `qa` to start recording a macro with the letter `a`.
2. enter the commands. When incrementing, use ^a and ^x to decrement instead of hard coding numbers.
3. press q when done with the commands.
4. `@a` to execute the command once. `10@a` to execute the command ten times. `@@` to execute the macro (that was entered most recently) again.