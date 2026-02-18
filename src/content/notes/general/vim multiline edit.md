---
tags:
  - cs
  - tips
  - vim
created: 2023-09-18 09:00
---

# Multiline Edit
[SO link](https://stackoverflow.com/questions/11784408/vim-multiline-editing-like-in-sublimetext)
##### Move cursor to position
```
print(|h|ello my name is jun)
print(|h|ello my name is jun)
print(|h|ello my name is jun)
print(|h|ello my name is jun)
print(|h|ello my name is jun)
```
##### `<C-v>` to enter visual block mode and move cursor down
```
print([h]ello my name is jun)
print([h]ello my name is jun)
print([h]ello my name is jun)
print([h]ello my name is jun)
print([h]ello my name is jun)
```

##### Move into line, then type your {word} then escape
###### Using shift-I, `I"<Esc>`
```
# Enter I"jk
print("Hello my name is jun)
print("Hello my name is jun)
print("Hello my name is jun)
print("Hello my name is jun)
print("Hello my name is jun)
```

###### Using shift-A, `A"<Esc>`


```
# at [n] in jun,
# Enter A"jk
print("Hello my name is jun")
print("Hello my name is jun")
print("Hello my name is jun")
print("Hello my name is jun")
print("Hello my name is jun")
```