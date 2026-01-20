---
tags:
  - cs
  - keycloak
created: 2026-01-13 19:41
edited: 2026-01-13 19:41
---
As of now in [[Keycloak]], there is no easy way to add a list of the user’s list to the session token.

Client Scope can be configured to add the names or full paths of the user’s groups.

At work, we needed to use group_ids, which were the UUIDs managed by keycloak, to map access permissions for certain resources.

Technically it was possible by adding a custom mapper to a Client Scope
[SO link: keycloak group id in token](https://stackoverflow.com/questions/59609731/keycloak-group-id-in-token-missing), but apparently adding this functionality is deprecated. (You can still turn this functionality on when starting up the keycloak server [SO link: keycloak script mapper option](https://stackoverflow.com/questions/62199404/keycloak-script-mapper-option-missing-in-9-0-3), but I did not test it as using deprecated functionality is not an option)

I ended up not using the session token to keep track of the user’s group ids, as this approach would need a session refresh if new groups were added.

- [ ] Instead I used the python-keycloak api to fetch the group information when we actually need to handle permission logic. This group-full-path-TO-groupid is stored in redis so that we don’t fetch the api too many times.