---
tags:
  - cs
  - crafting-interpreters
created: 2025-06-16 03:25
edited: 2025-06-16 03:25
---
Like [[Fruits vs Vegetables]], they are not mutually exclusive.

**Compiling**
implementation technique, translate a source language to another (usually lower level) form
generating bytecode or machine code == compiling
transpiling to another high-level language == compiling

translates, but does not execute. The user takes the output and runs it


**Interpreting**
takes in source code and executes it immediately.


**Examples**

GCC/Clang are compilers, they take in C code and compiles it to machine code.

Early implementations of Ruby was just an interpreter. The code was parsed and executed directly by traversing the syntax tree.

Cpython: python code is parsed and converted to an internal bytecode format, and executed in a VM. Interpreter from the user's perspective. But looking at Cpython internals, there definitely are aspects of a compiler