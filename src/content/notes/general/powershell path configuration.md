---
tags: 
  - cs
  - tips
  - powershell
created-date: 2023-09-18 09:00
---

```
New-Item $profile -Type File -Force

$Env:Path="C:\Users\my-user-name\apps\my-jdk-folder\bin;"+$Env:Path

echo $env:Path
```

[[links]]
- [dev.to link for configuring path variable in powershell](https://dev.to/qword/configure-path-variable-in-powershell-1g8o)