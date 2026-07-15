---
tags:
  - cs
created: 2025-06-16 03:30
edited: 2025-06-16 03:30
---
for [[Lox]], number literals are floating point at runtime, but decimal and integer literals are supported.

> A number literal is a series of digits optionally followed by a `.` and one or more trailing digits.

> Since we look only for a digit to start a number, that means `-123` is not a number _literal_. Instead, `-123`, is an _expression_ that applies `-` to the number literal `123`.

