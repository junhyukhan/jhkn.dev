---
tags:
  - cs
  - crafting-interpreters
created: 2025-06-16 20:36
edited: 2025-06-16 20:36
---
```java
bread --> "toast" | "biscuits" | "English muffin";

protein → ( "scrambled" | "poached" | "fried" ) "eggs" ;

crispiness → "really" "really"* ;

breakfast → protein ( "with" breakfast "on the side" )? ;
```

Condensed form:
```java
breakfast → protein ( "with" breakfast "on the side" )?
          | bread ;

protein   → "really"+ "crispy" "bacon"
          | "sausage"
          | ( "scrambled" | "poached" | "fried" ) "eggs" ;

bread     → "toast" | "biscuits" | "English muffin" ;
```