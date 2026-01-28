---
tags:
  - cs
  - api
  - fastapi
  - python
created: 2026-01-28 17:14
edited: 2026-01-28 17:14
---
Two main methods:
1. Comma separated values
2. Repeating the parameter name multiple times

It seems most backend frameworks support the second type. FastAPI, spring boot.
```bash
# 1 Comma separated
GET /items?ids=1,2,3

# 2 repeating the parameter name
GET /items?ids=1&ids=2&ids=3

# In both cases the backend should receive ids=[1,2,3]
```

At work we use vue that uses axios for making api calls.
The problem is that axios appends a `[]` to the end of the parameter name.
```bash
GET /items?ids[]=1&ids[]=2&ids[]=3
```

The handle this difference, we either need to use the `qs` library in the frontend or have the backend parse/handle the different convention.  
I ended up using an alias in the fastAPI backend to accept the above convention.