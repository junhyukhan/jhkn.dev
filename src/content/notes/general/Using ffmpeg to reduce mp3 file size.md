---
tags:
  - cs
  - tips
  - shell
created: 2026-02-03 23:26
edited: 2026-02-03 23:26
---

`ffmpeg -i <output-filename.mp3> -b:a 128k <input-filename.mp3>`

```bash
ffmpeg
-i file   # input file path
-b:a 128k # b for bitrate, a for audio stream. 128k defines the target speed of 128 kilobits per second, a standard balance between quality and size
```

| Bitrate | Quality Level        | File Size |
| ------- | -------------------- | --------- |
| 320k    | High (Near Lossless) | Largest   |
| 192k    | Standard High        | Moderate  |
| 128k    | Good (Standard)      | Small     |
| 96k     | Low (Talk/Podcasts)  | Smallest  |
