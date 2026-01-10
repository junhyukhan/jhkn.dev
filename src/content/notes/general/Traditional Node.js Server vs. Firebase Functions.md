---
tags:
  - cs
  - llm
  - question
created: 2025-08-21 09:59
edited: 2025-08-21 09:59
---
This note compares two backend approaches.

**[[Traditional Node.js Server]]:**
- **Pros:** Total control, predictable flat-rate cost.
- **Cons:** I have to manage it (updates, security, scaling), and I pay for it even when it's idle.

**[[Firebase Functions]]:**
- **Pros:** Zero management, scales automatically, and I only pay for what I use. The free tier is huge, so it's likely free for my MVP.
- **Cons:** Potential for [[Cold Start]] (which I can manage).

**Decision:** [[Firebase Functions]] is the clear winner for my project. The pay-per-use model and zero management let me focus on building the app.