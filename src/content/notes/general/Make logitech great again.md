---
title: Make Logitech Great Again
created: 2024-02-20 06:57
edited: 2024-02-20 6:57
tags:
- productivity
---

logitech mice and keyboards are great. The build quality, the design, the feel, the (insane) battery life are hard not to love. You can even reprogram the buttons found on top of the mouse to do 'basically' whatever you want.

The fact that you can switch between devices with a click of a button is an added bonus.

  

### The problem

is that the button for switching between devices is located on the bottom of the mouse. To switch between devices, you need to pick up your mouse, then click the button once (or more depending on the number of registered devices), put it back down, and repeat if you wanted to switch again.

Then... do the same for your logitech keyboard as they don't sync.

  

This is quite cumbersome. And to make things way harder, logitech doesn't allow users to map one of the buttons on the top of the mouse for device switching.

  

### The solution

[input-switcher repo](https://github.com/marcelhoffs/input-switcher)

Taking insight from the above repository, I was able to make the keyboard and mouse to switch pairing to the next device through a command line script, which I then mapped to a button on my mouse.

  

With a click of a button, I was able to simultaneously switch the connected device for both my mouse and keyboard. All this without using logitech's proprietary solution, logitech flow which was pretty buggy.