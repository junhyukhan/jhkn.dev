---
tags:
  - cs
  - gemini
  - llm
  - question
created: 2025-08-21 10:00 
edited: 2025-08-21 10:00
---
**Perceived Latency** is how fast a process _feels_ to the user, which can be managed with smart UX design even if the [[Actual Latency]] is unchanged.

- **Immediate Feedback:** Show a "typing..." indicator the instant the user hits send. This is a powerful psychological trick that fills the dead time.
    
- **Progressive Display:** Show the German text on screen as it streams in, word by word.
    
- **Play Audio ASAP:** Play the audio for the first sentence as soon as it's ready, while the rest is still being generated.
    
- **Generate Replies in Parallel:** Have the LLM generate the suggested user replies in the same API call as the main response, so they can appear instantly after the audio finishes.