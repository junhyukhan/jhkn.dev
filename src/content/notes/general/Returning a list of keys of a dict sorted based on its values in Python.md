---
tags:
  - cs
  - python
  - tips
created: 2026-02-14 19:22
edited: 2026-02-14 19:22
link:
---
```
data = {'a': 10, 'b': 50, 'c': 20}

# Sort keys based on the value of each key in data
result = sorted(data, key=data.get, reverse=True)

print(result)
# Output: ['b', 'c', 'a']
```

If both keys and values are needed:
```
data = {'a': 10, 'b': 50, 'c': 20}

# Sort keys based on the value of each key in data
result = sorted(data.items(), key=lambda item: item[1], reverse=True)

print(result)
# Output: [('b', 50), ('c', 20), ('a', 10)]
```