---
tags:
  - cs
  - js
created: 2025-06-16 03:24
edited: 2025-06-16 03:24
---
In my current project at work (LG ensol mmd), I had to rewrite some logic that got input from the user, and split up the input into chunks before inserting in the DB.

The columns in the DB (mssql) is of type `nvarchar(4000)` which can store 8000 bytes.

In the new javascript source code, I had to split up the string into 1000 characters.
At first, the logic used `str.length`, but it turns out doing this has a chance of splitting an individual character. So what I had to do was convert it to an array with `Array.from()` and get the length of the array.

The slight difference in the above logic is that, getting the length of the string doesn't get the number of characters, but the number of 2 byte pairs, or more accurately, UTF-16 code-units. UTF-16 characters are either 2 or 4 bytes long. To accurately get the number of characters of a string, you need to use a separate package or do something like I did: use an array.