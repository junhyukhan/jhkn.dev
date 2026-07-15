---
tags:
  - cs
created: 2025-06-16 03:23
edited: 2025-06-16 03:23
---
character [[encoding]] standard.
[[Unicode]] Transformation Format - 8 bit
Is used pretty much everywhere, and is able to represent all known characters of the world. 

- Variable Width, 1~4 bytes.
- Byte order does not matter. Does not have [[BOM]]'s as opposed to [[UTF-16]].
	- What this means is that, each byte in UTF-8 has bits that make it clear which position they are in a character.
	- [[Endianness]] does not matter
	- The character € (U+20AC) in UTF-8 is: E2 82 AC
	    - First byte: 11100010 (3-byte sequence)
	    - Second byte: 10000010 (continuation)
	    - Third byte: 10101100 (continuation)
	- Always read left to right
- backwards compatible with extended [[ASCII]] (8 bit bytes, values from 0~255)
	- he ASCII character 'A' is 0x41 → and in UTF-8, it’s also just **0x41**
	- This is why **UTF-8 was easy to adopt** on systems that were already using ASCII (like Unix/[[Linux]]).