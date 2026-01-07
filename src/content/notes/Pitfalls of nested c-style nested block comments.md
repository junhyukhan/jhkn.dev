---
tags:
  - cs
  - gemini
  - llm
  - question
  - crafting-interpreters
  - c
created: 2025-06-16 03:44
edited: 2025-06-16 03:44
---
Add support to Lox’s scanner for C-style `/* ... */` block comments. Make sure to handle newlines in them. Consider allowing them to nest. Is adding support for nesting more work than you expected? Why?

Implementing C-style `/* ... */` block comments in Lox's scanner involves recognizing the start and end delimiters and skipping the characters in between. Handling newlines is straightforward within this process. Allowing them to nest, however, significantly increases complexity.

Here's a brief outline of how you would implement this, along with a discussion on the nesting complexity:

### Brief Outline of Implementation

The core idea is to add a new state or logic to your scanner when it encounters `/*`.

1. **Detect `/*`:**
    
    - When the scanner is in its main `scanToken()` loop and encounters a `/`, it should peek at the next character.
    - If the next character is `*`, then you've found the start of a block comment.
2. **Consume Comment Content:**
    
    - Once `/*` is detected, enter a loop to consume characters until `*/` is found.
    - Inside this loop:
        - **Handle End of File (EOF):** If you reach the end of the source code before finding `*/`, it's an unterminated comment, which is an error. Report it.
        - **Handle Newlines:** If you encounter a newline character (`\n`), increment your line counter. This ensures that line numbers remain accurate for subsequent tokens after the comment.
        - **Consume Characters:** Advance the scanner's `current` pointer past each character within the comment.
        - **Detect `*/`:** Peek at the next character. If it's `*` and the character after that is `/`, then you've found the end of the comment. Consume both `*` and `/` and exit the comment consumption loop.
3. **Discard (Standard Behavior):**
    
    - After `*/` is consumed, the scanner should simply return to its main `scanToken()` loop. Since comments are typically discarded, you wouldn't emit a token for the comment itself.

### Example Pseudo-code (simplified)

```
scanToken() {
    // ... existing token scanning logic ...

    if (peek() == '/') {
        if (peekNext() == '*') {
            // Start of block comment
            advance(); // Consume '/'
            advance(); // Consume '*'
            skipBlockComment();
            return; // Comment discarded, go back to scanning for next token
        }
    }
    // ... rest of scanToken logic
}

skipBlockComment() {
    commentNestingLevel = 1; // If nesting allowed, start at 1 for the current comment

    while (true) {
        if (isAtEnd()) {
            error("Unterminated block comment.");
            return;
        }

        char = advance();

        if (char == '\n') {
            line++;
        } else if (char == '*') {
            if (peek() == '/') {
                advance(); // Consume '/'
                if (nestingAllowed) {
                    commentNestingLevel--;
                    if (commentNestingLevel == 0) {
                        return; // Found end of outermost comment
                    }
                } else {
                    return; // Found end of comment (no nesting)
                }
            }
        } else if (nestingAllowed && char == '/') {
            if (peek() == '*') {
                advance(); // Consume '*'
                commentNestingLevel++; // Found start of nested comment
            }
        }
    }
}
```

### Is adding support for nesting more work than you expected? Why?

**Yes, adding support for nesting is significantly more work than a non-nesting implementation.**

**Why?**

1. **State Management:**
    
    - **Non-Nesting:** A simple boolean flag or state (e.g., `inBlockComment = true`) is sufficient. When `/*` is seen, set the flag. When `*/` is seen, clear the flag and exit. You only care about the _first_ `*/` encountered.
    - **Nesting:** You can no longer rely on a simple flag. You need a **counter** (like `commentNestingLevel` in the pseudo-code above). Every time you see `/*`, you increment the counter. Every time you see `*/`, you decrement the counter. The comment only truly ends when the counter reaches zero. This transforms the comment parsing into a mini-state machine that needs to keep track of its "depth."
2. **Ambiguity and Edge Cases:**
    
    - Without nesting, `/* ... /* ... */ ... */` would end at the first `*/`. The remaining `*/` would likely cause a syntax error later. This is simpler to implement, even if it's less flexible for the programmer.
    - With nesting, you have to carefully consider the order of `/*` and `*/`. What if you have malformed comments like `/* /* */`? The nesting logic would handle this by decrementing the counter, but it's an extra layer of logic to ensure correct behavior.
    - This "counting" behavior is precisely what pushes the recognition of block comments from a purely regular language (which a basic scanner usually handles) towards a **context-free grammar**. A regular expression or [[finite automaton]] cannot count arbitrary depths of nesting. You need a stack-like mechanism (or a counter acting like a simplified stack) to keep track of the nesting level.
3. **Error Handling Complexity:**
    
    - For a non-nesting comment, an unterminated comment is simply an `EOF` before `*/`.
    - For a nesting comment, an unterminated comment could mean:
        - `EOF` before the `commentNestingLevel` reaches zero.
        - A `*/` without a corresponding `/*` (e.g., `Hello */`). While not strictly an error for the _comment_ parsing, it's an error for the program, and your scanner might need to report it differently if it encounters a `*/` when `commentNestingLevel` is already zero.

In essence, non-nesting block comments are a "find pattern X, then find pattern Y" problem. Nesting block comments become a "count occurrences of X and Y, and only stop when the count balances" problem, which requires more sophisticated state management within the scanner.