---
tags:
  - crafting-interpreters
  - cs
created: 2025-06-16 03:23
edited: 2025-06-16 03:23
---
**Front End**
[[Scanning]]
	Lexical analysis or lexing
	chunks the stream of characters into [[Tokens]]
	there exists meaningless characters like whitespace. this is disgarded and the result is a clean sequence of meaningful tokens
[[Parsing]]
	Grammar of the language
	The structure is organized as a [[Syntax Tree]] or [[Abstract Syntax Tree]]
	[[Syntax Errors]]
[[Static Analysis]]
	binding/resolution of attributes depending on their scope
	type checking if statically typed - type errors if applicable

**Middle End**
[[Intermediate Representations]]
The interface between the front and the backend
[[Optimization]]
	High optimization != good - Lua and CPython generate relatively unoptimized code, and focus most of their performance effort on the runtime

Back End
[[Code generation]]
	Decision to make: how close to the machine?
	our representation of the code becomes more and more primitive
	generating [[ByteCode]]
[[Virtual Machine]]
	translating the bytecode: mini compiler for each target architecture OR 
	emulate a hypothetical chip supporting your virtual architecture at runtime
[[Runtime]]
	[[garbage collector]] if memory is managed automatically
	if fully compiled: runtime inserted directly into the resulting executable (go, each compiled app has a copy of Go's runtime embedded in it)
	if interpreter or VM: runtime lives in it (java, python, javascript)

Shortcuts
[[Single-pass compilers]]
	[[Why C requires forward declarations]]
[[Tree-walk interpreters]]
[[Transpilers]]
[[Just-in-time compilation]]

[[Compilers vs Interpreters]]

Questions:

1. Pick an open source implementation of a language you like. Download the source code and poke around in it. Try to find the code that implements the scanner and parser. Are they handwritten, or generated using tools like Lex and Yacc? (`.l` or `.y` files usually imply the latter.)
    
2. Just-in-time compilation tends to be the fastest way to implement dynamically typed languages, but not all of them use it. What reasons are there to _not_ JIT?
    
3. Most Lisp implementations that compile to C also contain an interpreter that lets them execute Lisp code on the fly as well. Why?