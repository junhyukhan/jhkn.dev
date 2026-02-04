---
tags:
  - cs
  - keycloak
  - api
created: 2026-02-04 18:17
edited: 2026-02-04 18:17
---
The User session is the user’s long term connection to keycloak.
A session is [[Stateful]] and is managed on the keycloak server.

**In-Memory Storage**: In the keycloak server side, an [[In-Memory Storage]] called [[Infinispan]] is used to keep track of user sessions.

**Session ID**:The `sid` that’s also found in the JWT access token holds the session id of the user session.

**Server-side Validation**: When a client uses a [[Refresh Token]], Keycloak not only looks at the token signature, but also takes the `sid` to look at the internal infinispan cache to see if the specific `sid` is still active and hasn’t exceeded its Idle or Max time.

**Revocation**: Keycloak can ‘log out’ a user by deleting the session from the cache. Any refresh tokens that are associated with the deleted session is made instantly useless even if the `exp` has not been passed yet.