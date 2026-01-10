---
tags:
  - cs
  - cloudflare
created: 2026-01-08 10:47
edited: 2026-01-08 10:47
---
Images service in cloudflare allows you to “Easily store, resize, optimize, and serve images all in one place”

You are able to upload directly to the Cloudflare Images product or use
[[Image transformation]] for images stored outside of the aforementioned Images product (like an external S3 bucket)

There are multiple ways to transform Images
- Transform via URL
- Transform via Workers API
- Bind to Workers API
- …

The free tier only allows Image transformations.
5000 unique transformations are allowed in the free tier.
And a unique transformation consists of a unique combination of the parameters supported by cloudflare Images (quality, width, height, …)

One thing to note is that there is no built in way to limit which unique combination can be used. Ie) someone with a malicious intent can request an image with many different unique transformations to increase costs (not sure how likely this would be though)

To mitigate this, you can hide the actual image url given to you and make the requests from your server or you could create a workers api to handle this.
