---
tags:
  - cs
  - gemini
  - llm
  - question
created: 2025-08-21 09:58
edited: 2025-08-21 09:58
---
A **Cold Start** happens when my [[Firebase Functions]] has to spin up a new instance after being idle for a while (usually 15-45 mins). This can add a 1-3 second delay to the first request. It also happens when traffic spikes and new instances are needed, or right after I deploy new code.

**Solution:** For a consistently fast experience, I can set `minInstances` to `1` in my function's configuration. This keeps one instance warm 24/7, eliminating the **Cold Start**, but it has a small monthly cost.