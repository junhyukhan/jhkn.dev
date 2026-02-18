---
tags:
  - cs
  - config
  - vim
created: 2023-09-18 09:00
---
```shell
set nocompatible
syntax on
set shortmess+=I
set number
set relativenumber
set laststatus=2
set backspace=indent,eol,start
set hidden
set ignorecase
set smartcase
set incsearch
nmap Q <Nop> " 'Q' in normal mode enters Ex mode. You almost never want this.
set noerrorbells visualbell t_vb=
set mouse+=a
set pastetoggle=<Insert> " pressing the insert key will toggle paste mode
inoremap jk <ESC>
set tabstop=4
set shiftwidth=4
set noexpandtab
filetype on
filetype plugin on
filetype indent on
```