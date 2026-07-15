---
tags:
  - cs
  - keycloak
  - api
created: 2026-02-04 18:19
edited: 2026-02-04 18:19
---
[[Keycloak User session]]
[[Keycloak access token]]

| Layer        | Setting Name          | Purpose                                     | What happens when expired                                          |
| ------------ | --------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| Token        | Access Token Lifespan | Temporary proof of identity for APIs        | API returns 401. Client must use a refresh token to get a new one. |
| Idle Session | SSO Session Idle      | Tracks user inactivity (no token refreshes) | Refresh tokens no longer work. User must log in with credentials   |
| Max Session  | SSO Session Max       | Hard limit on session duration              | Session is killed regardless of activity. User must log in again.  |
