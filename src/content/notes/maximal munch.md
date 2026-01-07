---
tags:
  - crafting-interpreters
  - cs
created: 2025-06-16 03:23
edited: 2025-06-16 03:23
---
the important principle used during [[lexical analysis]] for when two lexical grammar rules can both match a chunk of code that the scanner is looking at, *whichever one matches the most characters wins.* 
ie) if we can match *orchid* as an *identifier* and *or* as a *keyword*, 
*orchid* is preferred as more characters are matched.