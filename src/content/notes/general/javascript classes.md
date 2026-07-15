---
tags: 
  - cs
  - js
created: 2025-09-12 02:34
edited: 2025-09-12 02:34
---
they are prototypes.

A class is a blueprint for create object instances, a **prototype IS an instance** that other object instances delegate work to, a **prototype** is not a blueprint, it actually exists, it **is** there.

This is why you can actually add a new method to `Array` and suddenly all arrays can use it. **This can be done in runtime, affecting an already instanced object.**
```javascript
var someArray = [1, 2, 3];

Array.prototype.newMethod = function() {  
  console.log('I am a new method!');  
};
someArray.newMethod(); // I am a new method!

// The above code would not be possible with real classes, because 
// modifying a blueprint does not modify whatever was built with it.
```


_In short, classes in Javascript are syntactic sugar for Prototype Inheritance._