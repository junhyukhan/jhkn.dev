---
tags:
  - cs
  - nvim
  - config
  - cheatsheet
  - llm
created: 2026-01-02 14:59
edited: 2026-01-02 14:59
---
## General & Navigation
* `<Space>sh` : Search Help (Search documentation)
* `<Space>sk` : Search Keymaps (See all active shortcuts)
* `<Space>sn` : Search Neovim (Open init.lua config)
* `<Space>s.` : Search Recent Files (Open recently edited files)
* `<Space><Space>` : Switch Buffers (Toggle between open files)
* `<Space>/` : Fuzzily search inside current buffer
* `<Esc>` : Clear search highlights

## Search & Replace (The "VS Code Cmd+D" Workflow)
* `*` : Search for word under cursor (highlights all matches)
* `cgn` : Change next match (deletes match and enters Insert mode)
* `.` : Repeat the change on the next match
* `<Space>sw` : Search current Word (Uses Telescope to find word across all files)

## Code Intelligence (LSP)
* `grn` : Rename symbol (Smart rename across project)
* `gra` : Code Action (The "Quick Fix" menu for errors/refactors)
* `grd` : Go to Definition (Jump to where code is defined)
* `grr` : Go to References (Show usages of symbol)
* `K` : Hover Documentation (Show info/types for symbol)
* `<Space>f` : Format buffer (Beautify code)
* `<Space>q` : Diagnostics (Open the error/warning list)

## Window Management
* `Ctrl + h` : Move focus Left
* `Ctrl + j` : Move focus Down
* `Ctrl + k` : Move focus Up
* `Ctrl + l` : Move focus Right
* `<Esc><Esc>` : Exit Terminal Mode

## Surround Editing (Mini.surround)
* `sa` + object + char : Add surround (e.g., `saiw"` adds " around word)
* `sd` + char : Delete surround (e.g., `sd"` removes " quotes)
* `sr` + old + new : Replace surround (e.g., `sr"'` changes " to ')

## Git
* `<Space>ss` : Select Telescope (Type `git_status` here to view changes)