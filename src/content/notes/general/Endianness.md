---
tags:
  - cs
created: 2025-06-16 03:24
edited: 2025-06-16 03:24
---
When a value uses **more than one byte**, like a 16-bit number (2 bytes), the **order of those bytes** can vary depending on the system:

- **[[Big-endian]]:** Most significant byte first (e.g. 0x12 0x34)
- **[[Little-endian]]:** Least significant byte first (e.g. 0x34 0x12)

This creates problems when you move files between systems with different architectures. For example, Windows is little-endian, but network protocols are big-endian.