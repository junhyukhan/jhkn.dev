---
tags:
  - cs
  - python
created: 2026-01-07 11:04
edited: 2026-01-07 11:04
---
Protocols in [[Python]]

Introduced in PEP 544, in Python 3.8.

A way to formalize [[Duck Typing]] in python using [[Static Type Checkers]]

Example:
```python
from typing import Protocol

class Printable(Protocol):
    def print_info(self) -> None:
		... # '...' indicates an abstract method that must be implemented
```

Any class that implements the `print_info` method automatically conforms to the Printable class.
Unlike [[Abstract Base Classes]](ABCs), 
- protocols are implicit, does not inherit a class
- `isinstance()` does not work by default. Using the `@runtime_checkable` decorator enables this.
- offers greater flexibility as you only care about the *structure* of the object, not its inheritance hierarchy