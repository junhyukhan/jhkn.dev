---
tags:
  - cs
  - js
created: 2026-02-02 01:20
edited: 2026-02-02 01:20
---
# Technical Analysis: Precise String Splitting for Cross-DB Migration

## 1. Problem Overview

The migration from MSSQL to Oracle involved moving large text blobs stored in multiple columns. The legacy system used naive splitting methods that didn't account for variable-length encoding, leading to two major risks:

- **Data Corruption:** Splitting a multi-byte UTF-8 character (like Korean characters) at an arbitrary byte boundary results in invalid sequences.
    
- **Storage Inefficiency:** Assuming every character is 4 bytes (the UTF-8 maximum) and splitting every 1,000 characters would waste up to 75% of the allocated space for Western text.
    

## 2. Technical Constraints

- **Source (MSSQL):** `NVARCHAR` columns (UTF-16), but often treated as blobs needing splitting.
    
- **Internal (JavaScript):** Strings are encoded in **UTF-16**. This means most characters take 2 bytes, but "Supplementary Planes" (like emojis or rare Hanja) use **Surrogate Pairs** (4 bytes total, string length of 2).
    
- **Target (Oracle):** `VARCHAR2(4000)` columns. Crucially, the limit of 4,000 is in **bytes**, not characters.
    
- **Encoding (UTF-8):** The standard for transmission/storage where characters vary between 1 and 4 bytes.
    

## 3. The Logic: Predicting UTF-8 Size via Code Points

The solution avoids converting the entire string to a UTF-8 Byte-Array (which would be memory-intensive for large blobs). Instead, it iterates through the UTF-16 string and uses the Unicode Code Point to predict the resulting UTF-8 byte size.

### UTF-8 Byte Calculation Rules

| **Code Point Range**    | **UTF-8 Bytes** |
| ----------------------- | --------------- |
| `U+0000` to `U+007F`    | 1 Byte          |
| `U+0080` to `U+07FF`    | 2 Bytes         |
| `U+0800` to `U+FFFF`    | 3 Bytes         |
| `U+10000` to `U+10FFFF` | 4 Bytes         |

## 4. Thought Process Pseudocode

```
/**
 * Goal: Split a JS UTF-16 string into chunks that fit into 
 * Oracle VARCHAR2(4000) byte-limited columns without breaking characters.
 */

function splitStringForOracle(longString, byteLimit = 4000) {
    const chunks = [];
    let currentChunkStart = 0;
    let currentByteCount = 0;

    for (let i = 0; i < longString.length; ) {
        // 1. Get the Unicode Code Point 
        // Handles Surrogate Pairs (JS length 2) as a single integer
        const codePoint = longString.codePointAt(i);
        
        // 2. Determine UTF-8 byte length for this code point
        let bytesForChar = 0;
        if (codePoint < 0x80) {
            bytesForChar = 1;
        } else if (codePoint < 0x800) {
            bytesForChar = 2;
        } else if (codePoint < 0x10000) {
            bytesForChar = 3;
        } else {
            bytesForChar = 4;
        }

        // 3. Check if adding this char exceeds the Oracle 4000-byte limit
        if (currentByteCount + bytesForChar > byteLimit) {
            // Cut the chunk here and start a new one
            chunks.push(longString.substring(currentChunkStart, i));
            currentChunkStart = i;
            currentByteCount = 0;
        }

        // 4. Update byte count and increment index
        currentByteCount += bytesForChar;
        
        // If codePoint > 0xFFFF, it's a surrogate pair (takes 2 slots in UTF-16 string)
        i += (codePoint > 0xFFFF) ? 2 : 1;
    }

    // Add the final remaining chunk
    chunks.push(longString.substring(currentChunkStart));
    return chunks;
}
```

## 5. Key Engineering Wins

1. **Memory Efficiency:** By using a pointer-based iteration (`i += ...`) instead of `Array.from()` or `[...str]`, the system avoids duplicating large strings into memory as arrays.
    
2. **Storage Optimization:** By calculating exact byte sizes, the system packs as much data as possible into each 4,000-byte column (e.g., ~4,000 English chars or ~1,333 Korean chars), rather than defaulting to a conservative 1,000 chars.
    
3. **Integrity Guarantee:** The `codePointAt` + surrogate check ensures that a 4-byte character is never split between two database columns, which would have rendered the data unreadable.