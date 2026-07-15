---
tags:
  - cs
  - tips
  - vim
created: 2023-09-18 09:00
---
# moving the current line up and down
The following key remaps allow you to move the current line up and down, while keeping the indentation of the outgoing line. 
Enter the following code into your `~/.vimrc` file:
```
nnoremap <A-j> :m .+1<CR>==
inoremap <A-j> <Esc>:m .+1<CR>==gi
vnoremap <A-j> :m '>+1<CR>gv=gv
nnoremap <A-k> :m .-2<CR>==
inoremap <A-k> <Esc>:m .-2<CR>==gi
vnoremap <A-k> :m '<-2<CR>gv=gv
```
One thing to note, for mac users, you need to change the above `<A-j>` and `<A-k>` parts as we don't have an alt key, and instead an option key.

All you need to do is change the above code in vim, and actually type option-j instead of `<A-j>`. You'll notice a special character gets input, something like `∆`.

So for mac users, your vim config file should look something like this.

```
nnoremap ∆ :m .+1<CR>==
inoremap ∆ <Esc>:m .+1<CR>==gi
vnoremap ∆ :m '>+1<CR>gv=gv
nnoremap ˚ :m .-2<CR>==
inoremap ˚ <Esc>:m .-2<CR>==gi
vnoremap ˚ :m '<-2<CR>gv=gv
```