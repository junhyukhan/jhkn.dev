---
tags:
  - api
  - auth
created: 2026-02-04 18:35
edited: 2026-02-04 18:35
---
Json Web Tokens.

Consists of three parts:
- Header
- Payload
- Signature

**[[Asymmetric Encryption]] (RS256)** is used.
In the case of [[Keycloak]], [[RSA]] is used. The token is signed using its [[Private Key]]. The resource server then uses Keycloak’s [[Public Key]] to verify its signature.

**Tamper Evidence**: Changing even one character of the payload like `exp` or `iat`, the signature will not match the content.
