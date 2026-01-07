---
tags:
  - cs
  - keycloak
  - api
created: 2026-01-02 13:25
edited: 2026-01-02 13:25
---
[keycloak api docs](https://www.keycloak.org/docs-api/latest/rest-api/index.html)
[gh issue 41103: Service Account users now showing in the User List](https://github.com/keycloak/keycloak/issues/41103)

**API endpints:**
GET /admin/realms/{realm}/users
GET /admin/realms/{realm}/users/count

**Description:**
Keycloak api allows several options for the above api endpoints.
- email, firstname, lastname, username (str)
- exact (boolean) - determines whether the above parameter values are matched exactly
- enabled (boolean) - enabled/disabled users. But explicitly setting enabled=True also returns service accounts.
- q (string) - query for custom attributes
- search - a string contained in the username/firstname/lastname/email
- first (int) - pagination offset (only for `/users`)
- max (int) - maximum result size, default of 100 (only for `/users`)
- ...

1. Setting `enabled=True` also returns service accounts for the `/users` api. Which is confusing as service accounts are never returned if `enabled` does not equal `True`.

2. For the `/users/count` api, when the `search` parameter is set, all the other parameters will be ignored. Meaning we cannot match the `/users/count` and `/users` apis for any queries with custom queries.

Detailed documentation for `/users/count`
> It can be called in three different ways. 1. Don’t specify any criteria and pass {@code null}. The number of all users within that realm will be returned. <p> 2. If {@code search} is specified other criteria such as {@code last} will be ignored even though you set them. The {@code search} string will be matched against the first and last name, the username and the email of a user. <p> 3. If {@code search} is unspecified but any of {@code last}, {@code first}, {@code email} or {@code username} those criteria are matched against their respective fields on a user entity. Combined with a logical and.[]()