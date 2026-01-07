---
tags:
  - cs
  - crafting-interpreters
created: 2025-06-16 03:24
edited: 2025-06-16 03:24
---
```java
  private char peek() {
    if (isAtEnd()) return '\0';
    return source.charAt(current);
  }
```

> It’s sort of like `advance()`, but doesn’t consume the character. This is called **lookahead**. Since it only looks at the current unconsumed character, we have _one character of lookahead_. The smaller this number is, generally, the faster the scanner runs. The rules of the lexical grammar dictate how much lookahead we need. Fortunately, most languages in wide use peek only one or two characters ahead.

from [[Crafting Interpreters]]