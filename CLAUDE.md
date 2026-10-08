# Towmatic Videos

Marketing and product videos for Towmatic, built with [HyperFrames](https://github.com/heygen-com/hyperframes):
HTML + CSS + GSAP compositions rendered deterministically to MP4.

## Start here

For any request to make, edit, animate, or render a video, **invoke the `/hyperframes` skill first**.
It routes to the right workflow (`/product-launch-video`, `/motion-graphics`, `/faceless-explainer`,
`/general-video`, ...) and the domain skills (`/hyperframes-core`, `/hyperframes-animation`, ...).
All 21 published HyperFrames skills are vendored in `.claude/skills/` so they load in every session.

## Layout

- `videos/<name>/` — one HyperFrames project per video (`index.html` root, `compositions/` scenes,
  `assets/` media). Each project has its own `CLAUDE.md` with the composition rules.
- `videos/towmatic-intro/` — 10s reference intro (wordmark → features → tagline). Copy its patterns.
- `website/` — static prototype of the towmatic.ai marketing site redesign (plain HTML/CSS/JS, no build).
  Its design system lives in `website/styles.css`; it does not use the video brand colors above.
  `website/HANDOFF.md` is the build spec for the live site (URLs, SEO, owner decisions); keep it current.
- `website-no-voice/` — alternate version of that site with Voice AI removed (online booking + dispatch only).
  Same structure and its own `HANDOFF.md`; changes to one site are not copied to the other automatically.
- `scripts/new-video.mjs` — scaffolds a project and vendors GSAP locally.
- `scripts/kie-image.mjs` — generates images with kie.ai into `videos/<name>/assets/images/`.
- `.claude/hooks/session-start.sh` — installs FFmpeg and the render browser in cloud sessions.

## Commands

```bash
npm run new -- <name> [--resolution=portrait]   # new project in videos/<name>
cd videos/<name>
npm run check                                   # lint + runtime + layout + motion + contrast
npx hyperframes@0.8.80 preview --background     # Studio preview
npx hyperframes@0.8.80 render --quality draft --output renders/<name>.mp4

# from the repo root: generate an image into videos/<project>/assets/images/<name>.jpg
npm run image -- <project> <name> "<prompt>" [--model=<alias>] [--aspect=16:9] [--set key=value]
npm run image -- --list                          # model aliases
```

## Repo conventions

- Image generation uses kie.ai. In cloud sessions the key is an environment API credential that the
  proxy attaches to `api.kie.ai` requests, so there is no `KIE_API_KEY` variable to read; locally, set
  `KIE_API_KEY`. Finished images download from `tempfile.aiquickdraw.com`, which must be allowed.
- Pick the model from the prompt, tell the user which one and why before generating, and honor a
  model they name: text/signs/UI → `gpt-image-2` or `ideogram-v3`; photoreal hero shots →
  `imagen4-ultra` or `seedream-5-pro`; general scenes → `nano-banana-2`/`nano-banana-pro`; drafts and
  variations → `nano-banana`. The script prints credits used. Model schemas: `https://docs.kie.ai/llms.txt`.

- Load GSAP from `assets/gsap.min.js`, never a CDN: headless Chrome in cloud sessions cannot reach
  CDNs through the proxy, which breaks `check` and renders (`gsap is not defined`).
  `npm run new` does this automatically.
- One sub-composition per scene under `compositions/`; prefix ids with the scene name.
- Brand: background `#0b0f14`, text `#f5f7fa`, muted `#9aa7b5`, accent `#ffb400`, cards `#141b24`.
- `renders/` and `*.mp4` outputs are gitignored; source media under `assets/` is committed.
- The CLI is pinned to `hyperframes@0.8.80`. Refresh vendored skills by copying `skills/` from the
  upstream repo into `.claude/skills/` when upgrading.
