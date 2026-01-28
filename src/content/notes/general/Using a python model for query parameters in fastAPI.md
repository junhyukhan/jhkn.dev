---
tags:
  - cs
  - python
  - fastapi
created: 2026-01-28 17:29
edited: 2026-01-28 17:29
---
```python
Annotated[param, Query()]
# where param is a python class that has pydantic’s Fields.
```
The above can be used to designate a python class’s pydantic Fields as query parameters.

This can be helpful as adding more or changing the individual fields does not change the function signature of the router.

`Depends()` can be used as well to designate a [[pydantic]] model’s fields as the query paramater. However, the official docs now recommend the `Query()` approach. 

+while debugging, I learned that aliases for the fields don’t work when going for the `Depends()` method. Which is a problem as [[Passing a list as a query parameter]] may need you to use an alias for the query parameter name.