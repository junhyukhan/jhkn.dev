---
tags:
  - cs
  - llm
  - question
created: 2025-08-21 10:00
edited: 2025-08-21 10:00
---
**Actual Latency** is the real, measurable time it takes for a process to complete, from request to response. For my app, I can reduce this in a few ways:

- **Stream the LLM Response:** Get the AI's response word by word instead of waiting for the whole thing.
    
- **Chain the TTS Request:** As soon as the first sentence is streamed from the LLM, send it to the TTS API. This pipelines the process.
    
- **Use Faster Models:** Opt for models like Gemini 1.5 Flash that are optimized for speed.
    
- **Co-locate Services:** Make sure my [[Firebase Functions]] are in the same region as the AI services to minimize network lag.