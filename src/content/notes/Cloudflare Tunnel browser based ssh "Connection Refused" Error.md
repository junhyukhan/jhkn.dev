---
tags:
  - cs
  - bugfix
  - kubernetes
  - cloudflare
created: 2025-10-20 02:13
edited: 2025-10-20 02:13
---
### # 1. Cloudflare Tunnel "Connection Refused" Error

- **Problem:** `cloudflared` logs showed a `connection refused` error for `localhost:22`.
    
- **Cause:** The tunnel was running in a Kubernetes container. Inside a container, `localhost` refers to the container itself, not the host machine where the SSH service was running.
    
- **Fix:** Add `hostNetwork: true` to the pod's Deployment YAML. This makes the container share the host's network, allowing it to connect to `localhost` correctly.