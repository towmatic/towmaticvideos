# towmaticvideos

Towmatic videos built with [HyperFrames](https://github.com/heygen-com/hyperframes) — write HTML, render MP4.

## Requirements

Node.js 22+ and FFmpeg. Then download the render browser once:

```bash
npx hyperframes@0.8.80 browser ensure
npm run doctor
```

(Claude Code on the web does this automatically via `.claude/hooks/session-start.sh`.)

## Make a video

With Claude Code, just describe it:

> Using /hyperframes, make a 15-second vertical promo for Towmatic's impound lot tracking.

Or by hand:

```bash
npm run new -- impound-promo --resolution=portrait
cd videos/impound-promo
npm run dev       # live preview in the browser
npm run check     # validate
npm run render    # render to MP4
```

## Videos

| Project | Length | Notes |
| --- | --- | --- |
| [`videos/towmatic-intro`](videos/towmatic-intro) | 10s, 1920×1080 | Reference brand intro: wordmark, features, tagline |
