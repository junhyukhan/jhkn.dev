---
tags: 
  - cs
  - tips
  - shell
created-date: 2023-09-18 09:00
---
[[links]]
- [list all enabled services from systemctl](https://askubuntu.com/questions/795226/how-to-list-all-enabled-services-from-systemctl)


	- `systemctl list-unit-files | grep enabled`
	- `systemctl | grep running`

```
systemctl list-unit-files | grep enabled
systemctl | grep running

```